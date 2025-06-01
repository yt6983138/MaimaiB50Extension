import {
  MAIMAI_RECORD_RECENT_URL,
  ensureAbleToExecuteOrThrow,
  Difficulty,
  ClearType,
} from "./constants.js";
import {
  parseDifficultyIcon,
  parseTrackNumberFromText,
} from "./utils/parser.js";
import {
  parseAchievementText,
  parseScoreRankIcon,
  parseFcTypeIcon,
  parseSyncPlayTypeIcon,
  parseClearTypeIcon,
  extractMusicIdFromCoverUrl,
  parseDeluxscoreText,
} from "./utils/parser.js";

/**
 * 補充：從 "TRACK 04" 文字中解析曲目編號
 * @param {string} text
 */
function parseTrackNumber(text) {
  const match = text.match(/TRACK\s+(\d+)/i);
  if (match) return parseInt(match[1]);
  return 0;
}

/**
 * 解析單筆最近紀錄
 * @param {Cheerio} $node
 * @returns {object}
 */
function parseRecentRow($node) {
  const $ = window.$;

  const diffIconSrc = $node.find(".playlog_diff").attr("src");
  const difficulty = parseDifficultyIcon(diffIconSrc);

  const subtitleText = $node.find(".sub_title").text();
  const trackNumber = parseTrackNumber(subtitleText);
  const timeText = $node.find(".sub_title span").last().text();
  const playTime = new Date(timeText);

  // CLEAR
  const clearType = parseClearTypeIcon($node.find(".basic_block img").attr("src"));

  const displayName = clearType === ClearType.NOT_CLEAR ? $node.find(".basic_block").text().trim() : $node.find(".basic_block").contents().filter((_, el) => el.nodeType === 3).text().trim();

  const coverUrl = $node.find(".music_img").attr("src");
  const musicId = extractMusicIdFromCoverUrl(coverUrl);

  // SCORE RANK & others icons
  const scoreRank = parseScoreRankIcon($node.find(".playlog_scorerank").attr("src"));

  // Achievement
  const achievementText = $node.find(".playlog_achievement_txt").clone().children().remove().end().text();
  const achievementPercent = parseAchievementText(achievementText);
  const isAchievementNewRecord = $node.find(".playlog_achievement_newrecord").length > 0;

  // FC / SYNC / RANK
  const fcType = parseFcTypeIcon($node.find(".playlog_result_innerblock img[src*='fc']").attr("src"));
  const syncPlayType = parseSyncPlayTypeIcon($node.find(".playlog_result_innerblock img[src*='sync'], .playlog_result_innerblock img[src*='fs']").attr("src"));

  let syncPlayRank = 0;
  const rankImgSrc = $node.find(".playlog_result_innerblock img[src*='playlog/']").filter((_, img) => img.src.match(/(\d+)st|nd|rd/)).attr("src");
  if (rankImgSrc) {
    const rankMatch = rankImgSrc.match(/playlog\/(\d)(?:st|nd|rd)\.png/);
    if (rankMatch) syncPlayRank = parseInt(rankMatch[1]);
  }

  // DX score
  const dxScoreText = $node.find(".playlog_score_block div").first().text();
  const [deluxscore, deluxscoreMax] = parseDeluxscoreText(dxScoreText);
  const isDeluxscoreNewRecord = $node.find(".playlog_deluxscore_newrecord").length > 0;

  const detailId = $node.find("form input[name='idx']").val();

  return {
    title: displayName,
    difficulty,
    trackNumber,
    playTime,
    score: achievementPercent,
    scoreRank,
    musicId,
    musicCoverUrl: coverUrl,
    isAchievementNewRecord,
    deluxscore,
    deluxscoreMax,
    isDeluxscoreNewRecord,
    clearType,
    fcType,
    syncPlayType,
    syncPlayRank,
    detailId,
  };
}

/**
 * 取得最近紀錄清單
 * @returns {Promise<Array<object>>}
 */
export async function getRecentRecords() {
  ensureAbleToExecuteOrThrow();
  const html = await fetch(MAIMAI_RECORD_RECENT_URL).then((r) => r.text());
  const $ = window.$;
  const $wrapper = $("<div></div>").html(html);

  const records = [];
  $wrapper.find(".p_10").each((_, el) => {
    try {
      const record = parseRecentRow($(el));
      records.push(record);
    } catch (e) {
      console.warn("parse recent row failed", e);
    }
  });

  return records;
} 
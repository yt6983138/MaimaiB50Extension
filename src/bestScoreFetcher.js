import {
  MAIMAI_RECORD_BEST_BASE,
  Difficulty,
  ClearType,
  ensureAbleToExecuteOrThrow,
} from "./constants.js";
import {
  parseAchievementText,
  parseScoreRankIcon,
  parseFcTypeIcon,
  parseSyncPlayTypeIcon,
  extractMusicIdFromCoverUrl,
  parseDeluxscoreText,
  isDummyIcon,
  parseDifficultyIcon,
  normalizeLevelText,
} from "./utils/parser.js";

/**
 * 解析單一歌曲區塊 DOM
 * @param {Cheerio} $node jQuery 節點
 * @param {number} difficulty
 * @returns {object}
 */
function parseBestRow($node, difficulty) {
  const $ = window.$;
  const musicCoverUrl = $node.find(".music_img img").attr("src");
  const musicId = extractMusicIdFromCoverUrl(musicCoverUrl);
  const title = $node.find(".music_name_block").text().trim();
  const levelText = normalizeLevelText($node.find(".music_lv_back").text());

  const scoreText = $node.find(".music_score_block").first().text();
  const achievementPercent = parseAchievementText(scoreText);

  // DX score
  let deluxscore = 0;
  let deluxscoreMax = 0;
  const dxText = $node.find(".music_score_block").eq(1).text();
  if (dxText) {
    const [dx, dxMax] = parseDeluxscoreText(dxText);
    deluxscore = dx;
    deluxscoreMax = dxMax;
  }

  // 圖示解析
  const scoreRank = parseScoreRankIcon($node.find('img[src*="music_icon_"]').filter((_, img) => !isDummyIcon(img.src)).eq(0).attr("src"));
  const fcType = parseFcTypeIcon($node.find('img[src*="music_icon_fc"]').attr("src"));
  const syncPlayType = parseSyncPlayTypeIcon($node.find('img[src*="music_icon_sync"], img[src*="music_icon_fs"]').attr("src"));

  return {
    title,
    difficulty,
    level: levelText,
    score: achievementPercent,
    scoreRank,
    musicId,
    musicCoverUrl,
    deluxscore,
    deluxscoreMax,
    fcType,
    syncPlayType,
  };
}

/**
 * 抓取所有難度的最佳成績
 * @returns {Promise<Array<object>>}
 */
export async function getBestScores() {
  ensureAbleToExecuteOrThrow();
  const result = [];
  const diffs = [
    Difficulty.BASIC,
    Difficulty.ADVANCED,
    Difficulty.EXPERT,
    Difficulty.MASTER,
    Difficulty.RE_MASTER,
  ];

  for (const diff of diffs) {
    const url = MAIMAI_RECORD_BEST_BASE + diff;
    const html = await fetch(url).then((r) => r.text());
    const $ = window.$;
    const $wrapper = $("<div></div>").html(html);

    $wrapper
      .find(
        ".music_master_score_back, .music_basic_score_back, .music_advanced_score_back, .music_expert_score_back, .music_remaster_score_back"
      )
      .each((_, el) => {
        try {
          const record = parseBestRow($(el), diff);
          result.push(record);
        } catch (e) {
          console.warn("parse best row failed", e);
        }
      });
  }

  return result;
} 
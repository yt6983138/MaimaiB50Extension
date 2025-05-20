/**
 * @enum {number}
 */
const Difficulty = {
	BASIC: 0,
	ADVANCED: 1,
	EXPERT: 2,
	MASTER: 3,
	REMASTER: 4,

	ALL: 99,
};
/**
 * @enum {number}
 */
const ClearType = {
	NOT_CLEAR: 0,
	CLEAR: 1,
};
/**
 * @enum {number}
 */
const MusicKind = {
	DX: 0,
	STANDARD: 1,
};
/**
 * @enum {number}
 */
const ScoreRank = {
	D: 0,
	C: 1,
	B: 2,
	BB: 3,
	BBB: 4,
	A: 5,
	AA: 6,
	AAA: 7,
	S: 8,
	SPLUS: 9,
	SS: 10,
	SSPLUS: 11,
	SSS: 12,
	SSSPLUS: 13,
};
/**
 * @enum {number}
 */
const FcType = {
	NONE: 0,
	FC: 1,
	FCPLUS: 2,
	AP: 3,
	APPLUS: 4,
};
/**
 * @enum {number}
 */
const SyncPlayType = {
	NONE: 0,
	SYNC: 1,
	FS: 2,
	FSPLUS: 3,
	FSD: 4,
	FSDPLUS: 5,
};

const MAIMAI_HOST = "https://maimaidx-eng.com";
const MAIMAI_RECORD_URL = MAIMAI_HOST + "/maimai-mobile/record/";
const MAIMAI_PLAY_DETAIL_BASE = MAIMAI_RECORD_URL + "playlogDetail/?idx=";
const MAIMAI_RECORD_BEST_BASE = MAIMAI_RECORD_URL + "musicMybest/search/?diff=";
const MAIMAI_RECORD_MUSIC_DETAIL_BASE = MAIMAI_RECORD_URL + "musicDetail/?idx=";

/**
 * true if ok, false if error
 * @returns {boolean}
 */
function ensureAbleToExecute() {
	if (document.URL.includes(MAIMAI_HOST) === false) {
		console.warn("not on maimai site, url: " + document.URL);
		return false;
	}
	return true;
}
/**
 * throws if not on maimai site
 * @returns {void}
 */
function ensureAbleToExecuteOrThrow() {
	if (ensureAbleToExecute() === false) {
		throw new Error("not on maimai site, url: " + document.URL);
	}
}

/**
 *
 * @param {Response} response
 * @returns {Promise<string>}
 * @throws {Error} if response is not ok
 */
async function getResponseAsText(response) {
	if (response.ok) {
		return await response.text();
	} else {
		throw new Error("response error, status: " + response.status);
	}
}
/**
 *
 * @param {Response} response
 * @param {string} type
 * @returns {Promise<Document>}
 * @throws {Error} if response is not ok
 */
async function getResponseAsDOM(response, type = "text/html") {
	const text = await getResponseAsText(response);
	const doc = new DOMParser().parseFromString(text, type);
	return doc;
}

/**
 * remove useless nodes from the DOM, also make the main content the root
 * @param {Document} dom
 */
async function removeBasicDOMShit(dom) {
	dom.head.remove();
	for (const node of new Array(...dom.body.children)) {
		if (node.classList.contains("main_wrapper")) {
			dom.documentElement.remove();
			dom.appendChild(node);
		}
	}
	dom.documentElement.querySelector("header")?.remove();
	dom.documentElement.querySelector("footer")?.remove();
	// dom.documentElement.querySelector(".title.m_10")?.remove();
	// dom.documentElement.querySelector(".m_t_5.m_b_10.t_l.f_0")?.remove();
	// dom.documentElement.querySelector(".m_15")?.remove();
	// dom.documentElement.querySelector(".f_0")?.remove();
}

/**
 *
 * @param {string} url
 * @returns {Difficulty}
 * @throws {Error} if url is invalid
 */
function parseDifficultyFromUrl(url) {
	// ex: https://maimaidx-eng.com/maimai-mobile/img/diff_advanced.png
	const match = url.match(/diff_(\w+)\.png/);
	if (match) {
		const difficulty = match[1].toUpperCase();
		if (difficulty in Difficulty) {
			return Difficulty[difficulty];
		}
	}
	throw new Error("invalid difficulty url: " + url);
}
/**
 *
 * @param {string} text
 * @returns {number}
 * @throws {Error} if text is invalid
 */
function parseTrackNumberFromText(text) {
	// ex: TRACK 04
	const match = text.match(/TRACK (\d+)/);
	if (match) {
		return parseInt(match[1]);
	}
	throw new Error("invalid track number text: " + text);
}
/**
 *
 * @param {string} text
 * @returns {[number, number]} index 0 is deluxscore, index 1 is max deluxscore
 */
function parseDeluxscoreFromText(text) {
	const texts = text.replaceAll(",", "").split("/");
	return [parseInt(texts[0]), parseInt(texts[1])];
}
/**
 *
 * @param {string?} url
 * @returns {ClearType}
 * @throws {Error} if url is invalid
 */
function parseClearTypeFromUrl(url) {
	// ex: https://maimaidx-eng.com/maimai-mobile/img/playlog/clear.png
	if (url === null || url === undefined || url === "") {
		return ClearType.NOT_CLEAR;
	}

	const match = url.match(/playlog\/(\w+)\.png/);
	if (match) {
		const clearType = match[1].toUpperCase();
		if (clearType in ClearType) {
			return ClearType[clearType];
		}
	}
	throw new Error("invalid clear type url: " + url);
}
/**
 * pure id, like a5c6705e2bfa3419
 * @param {string} url
 * @returns {string}
 * @throws {Error} if url is invalid
 */
function parseMusicIdFromUrl(url) {
	// ex: https://maimaidx-eng.com/maimai-mobile/img/Music/a5c6705e2bfa3419.png
	const match = url.match(/Music\/([a-zA-Z0-9]+)\.png/);
	if (match) {
		return match[1];
	}
	throw new Error("invalid music id url: " + url);
}
/**
 *
 * @param {string} url
 * @returns {MusicKind}
 * @throws {Error} if url is invalid
 */
function parseMusicKindFromUrl(url) {
	// ex: https://maimaidx-eng.com/maimai-mobile/img/music_dx.png
	const match = url.match(/music_(\w+)\.png/);
	if (match) {
		const musicKind = match[1].toUpperCase();
		if (musicKind in MusicKind) {
			return MusicKind[musicKind];
		}
	}
	throw new Error("invalid music kind url: " + url);
}
function parseScoreRankFromUrl(url) {
	// ex: https://maimaidx-eng.com/maimai-mobile/img/playlog/splus.png
    // https://maimaidx-eng.com/maimai-mobile/img/music_icon_sp.png
	const match = url.match(/\/(\w+)\.png/);
	if (match) {
		const scoreRank = match[1].toUpperCase()
            .replaceAll("MUSIC_ICON_", "");
        if (scoreRank === "SP") return ScoreRank.SPLUS;
        if (scoreRank === "SSP") return ScoreRank.SSPLUS;
        if (scoreRank === "SSSP") return ScoreRank.SSSPLUS;

		if (scoreRank in ScoreRank) {
			return ScoreRank[scoreRank];
		}
	}
	throw new Error("invalid song rank url: " + url);
}
/**
 *
 * @param {string} url
 * @returns {FcType}
 * @throws {Error} if url is invalid
 */
function parseFcTypeFromUrl(url) {
	// ex: https://maimaidx-eng.com/maimai-mobile/img/playlog/fc.png
	// https://maimaidx-eng.com/maimai-mobile/img/music_icon_fc.png
	const match = url.match(/\/(\w+)\.png/);
	if (match) {
		const fcType = match[1]
            .toUpperCase()
            .replaceAll("MUSIC_ICON_", "")
            .replaceAll("BACK", "DUMMY");
        if (fcType === "FCP") return FcType.FCPLUS;
        if (fcType === "APP") return FcType.APPLUS;

		if (fcType.includes("DUMMY")) return FcType.NONE;
		if (fcType in FcType) {
			return FcType[fcType];
		}
	}
	throw new Error("invalid fc type url: " + url);
}
/**
 *
 * @param {string} url
 * @returns {SyncPlayType}
 * @throws {Error} if url is invalid
 */
function parseSyncPlayTypeFromUrl(url) {
	// ex: https://maimaidx-eng.com/maimai-mobile/img/playlog/sync.png
	// https://maimaidx-eng.com/maimai-mobile/img/music_icon_sync.png
	const match = url.match(/\/(\w+)\.png/);
	if (match) {
		const syncPlayType = match[1].toUpperCase()
        .replaceAll("MUSIC_ICON_", "")
        .replaceAll("BACK", "DUMMY");
        if (syncPlayType === "FSDP") return SyncPlayType.FSDPLUS;
        if (syncPlayType === "FSP") return SyncPlayType.FSPLUS;

		if (syncPlayType.includes("DUMMY")) return SyncPlayType.NONE;
		if (syncPlayType in SyncPlayType) {
			return SyncPlayType[syncPlayType];
		}
	}
	throw new Error("invalid sync play type url: " + url);
}
/**
 *
 * @param {string} url
 * @returns {number}
 * @throws {Error} if url is invalid
 */
function parseSyncPlayRankFromUrl(url) {
	// ex: https://maimaidx-eng.com/maimai-mobile/img/playlog/2nd.png
	if (url === null || url === undefined || url === "") {
		return 0;
	}

	const match = url.match(/playlog\/(\w+)\.png/);
	if (match) {
		const syncPlayRank = match[1].substring(0, 1);
		return parseInt(syncPlayRank);
	}
	throw new Error("invalid sync play rank url: " + url);
}

/**
 *
 * @param {string} playlogId
 * @returns {string}
 */
function getPlayDetailUrl(playlogId) {
	return MAIMAI_PLAY_DETAIL_BASE + encodeURI(playlogId);
}
/**
 *
 * @param {Difficulty} difficulty
 * @returns {string}
 */
function getBestRecordSearchUrl(difficulty) {
	return MAIMAI_RECORD_BEST_BASE + difficulty.toString();
}
/**
 *
 * @param {string} idx
 * @returns {string}
 */
function getMusicDetailUrl(idx) {
	return MAIMAI_RECORD_MUSIC_DETAIL_BASE + encodeURI(idx);
}

async function getDetailedMusicRecord(idx) {
	ensureAbleToExecuteOrThrow();
	const dom = await getResponseAsDOM(await fetch(getMusicDetailUrl(idx)));
	removeBasicDOMShit(dom);

	const basicBlock = dom.documentElement.querySelector(".basic_block");
	const innerBlockDivs = basicBlock.querySelector(".w_250").querySelectorAll("div");

	const musicId = parseMusicIdFromUrl(basicBlock.firstElementChild.src);
	const songDisplayName = innerBlockDivs[1].textContent;
	const songArtist = innerBlockDivs[2].textContent.trim();

	for (const element of dom.documentElement.children) {
        if (element.id === undefined || element.id === null || element.id === "") element.remove();
    }
    if (!(dom.documentElement.lastElementChild.id)) dom.documentElement.lastElementChild.remove();

	for (const node of dom.documentElement.children) {
		const innerBlock = node.querySelector(".t_r.f_r");
		const innerBlock2 = node.lastElementChild;

		const blackBlock = innerBlock.querySelector(".black_block").querySelector("table").tBodies[0];

		const difficulty = parseDifficultyFromUrl(node.querySelector("img").src);
		const musicKind = parseMusicKindFromUrl(node.querySelector(".music_kind_icon").src);
		const songDisplayLevel = parseInt(node.querySelector(".music_lv_back").innerText);

		const imgs = innerBlock.querySelectorAll("img");
		const scoreRank = parseScoreRankFromUrl(imgs[0].src);
		const fcType = parseFcTypeFromUrl(imgs[1].src);
		const syncPlayType = parseSyncPlayTypeFromUrl(imgs[2].src);

		const lastPlayDate = new Date(blackBlock.rows[0].cells[1].innerText);
		const playCount = parseInt(blackBlock.rows[1].cells[1].innerText);

		const achievementPercent = parseFloat(innerBlock2.firstElementChild.innerText);
		const deluxscoreTexts = parseDeluxscoreFromText(innerBlock2.lastElementChild.lastChild.textContent);
		const deluxscore = deluxscoreTexts[0];
		const deluxscoreMax = deluxscoreTexts[1];
	}
}
async function getAllRecordsBySearch() {
	ensureAbleToExecuteOrThrow();
	const dom = await getResponseAsDOM(await fetch(getBestRecordSearchUrl(Difficulty.ALL)));
	removeBasicDOMShit(dom);
    dom.documentElement.querySelector(".m_15").remove();

	let delay = 0;
	for (const node of dom.documentElement.children) {
        if (!node.classList.contains("music_all_score_back")) continue;
		setTimeout(async () => {
			await getDetailedMusicRecord(node.firstElementChild.querySelector("input").value);
		}, delay);
		delay += 400;
	}
}
async function getBasicRecords() {
	ensureAbleToExecuteOrThrow();
	const dom = await getResponseAsDOM(await fetch(MAIMAI_RECORD_URL));
	removeBasicDOMShit(dom);
	for (const node of dom.documentElement.children) {
        if (!node.classList.contains("p_10")) continue;

		const topContainer = node.firstElementChild;
		const subtitle = topContainer.querySelector(".sub_title");

		const moreContainer = node.lastElementChild;
		const basicBlock = moreContainer.querySelector(".basic_block");
		const prBlock = moreContainer.children[1];
		const playResult = moreContainer.querySelector(".playlog_result_block");

		const playAchievement = playResult.querySelector(".playlog_achievement_txt");
		const playResultInnerBlock = playResult.querySelector(".playlog_result_innerblock");

		const scoreBlock = playResultInnerBlock.querySelector(".playlog_score_block");

		// datas
		const difficulty = parseDifficultyFromUrl(topContainer.querySelector(".playlog_diff").src);
		const trackNumber = parseTrackNumberFromText(subtitle.firstElementChild.innerText);
		const playTime = new Date(subtitle.lastElementChild.innerText);

		const clearType = parseClearTypeFromUrl(basicBlock.querySelector("img")?.src);
		const displayName = clearType === ClearType.NOT_CLEAR ? basicBlock.innerText : basicBlock.childNodes[1].textContent;
		const musicId = parseMusicIdFromUrl(prBlock.querySelector(".music_img").src);
		const musicKind = parseMusicKindFromUrl(prBlock.querySelector(".playlog_music_kind_icon").src);

		const scoreRank = parseScoreRankFromUrl(playResult.querySelector(".playlog_scorerank").src);

		const achievementPercent = parseFloat(playAchievement.firstChild.textContent + playAchievement.firstElementChild.innerText);
		const isAchievementNewRecord = playAchievement.querySelector(".playlog_achievement_newrecord") !== null;

		const fcType = parseFcTypeFromUrl(playResultInnerBlock.children[1].src);
		const syncPlayType = parseSyncPlayTypeFromUrl(playResultInnerBlock.children[2].src);
		const syncPlayRank = parseSyncPlayRankFromUrl(playResultInnerBlock.children.length > 4 ? playResultInnerBlock.children[3].src : null);

		const isDeluxscoreNewRecord = scoreBlock.querySelector(".playlog_deluxscore_newrecord") !== null;
		const deluxscoreTexts = parseDeluxscoreFromText(scoreBlock.querySelector("div").innerText);
		const deluxscoreMax = deluxscoreTexts[1];
		const deluxscore = deluxscoreTexts[0];

		const detailId = playResult.querySelector("form").querySelector("input").value;
	}

	return dom;
}

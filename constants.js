const ROMAN_MAP = {
	// Hiragana
	'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
	'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
	'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
	'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
	'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
	'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
	'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'mo': 'mo',
	'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
	'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
	'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo',
	'ん': 'n', 'ゔ': 'vu',
	'が': 'ga', 'gi': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
	'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
	'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
	'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
	'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
	'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o',
	'ゕ': 'ka', 'ゖ': 'ke', 'っ': 'tsu', 'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo', 'ゎ': 'wa',
	// Katakana
	'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
	'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
	'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
	'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'て': 'te', 'ト': 'to',
	'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
	'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ほ': 'ho',
	'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
	'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
	'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
	'ワ': 'wa', 'ヰ': 'wi', 'ヱ': 'we', 'ヲ': 'wo',
	'ン': 'n', 'ヴ': 'vu',
	'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
	'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
	'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
	'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
	'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ぺ': 'pe', 'ポ': 'po',
	'ァ': 'a', 'ィ': 'i', 'ゥ': 'u', 'ェ': 'e', 'ォ': 'o',
	'ヵ': 'ka', 'ヶ': 'ke', 'ッ': 'tsu', 'ャ': 'ya', 'ュ': 'yu', 'ョ': 'yo', 'ヮ': 'wa',
	'ー': '-'
};

let qi = [];
qi["Ja"] = [
	["hiragana", "Hiragana"],
	["katakana", "Katakana"],
	["g1", "Grade 1"],
	["g2", "Grade 2"],
	["g3", "Grade 3"],
	["g4", "Grade 4"],
	["g5", "Grade 5"],
	["g6", "Grade 6"],
	["g7", "Junior high school"],
	["g8", "Jinmeiyō"],
	["g9", "Some hyōgai"],
	["gc", "Some components"],
	["stroke", "Strokes"]
];
qi["Ko"] = [
	["hanja8", "Hanja level 8"],
	["hanja7", "Hanja level 7"],
	["hanja6", "Hanja level 6"],
	["hanja5", "Hanja level 5"],
	["hanja4", "Hanja level 4"],
	["ku", "Some uncommon hanja"],
	["kc", "Some components"]
];
qi["ZhHans"] = [
	["hsk31", "HSK v3 level 1, simplified hanzi"],
	["hsk32", "HSK v3 level 2, simplified hanzi"],
	["hsk33", "HSK v3 level 3, simplified hanzi"],
	["hsk34", "HSK v3 level 4, simplified hanzi"],
	["hsk35", "HSK v3 level 5, simplified hanzi"],
	["hsk36", "HSK v3 level 6, simplified hanzi"],
	["hsk37", "HSK v3 level 7, simplified hanzi"],
	["hsk38", "HSK v3 level 8, simplified hanzi"],
	["hsk39", "HSK v3 level 9, simplified hanzi"],
	["frequentNotHsk3", "Other frequently used hanzi"],
	["commonNotHsk3NorFrequent", "Other commonly used hanzi"],
	["uncommon", "Some uncommon hanzi"],
	["traditional", "Some traditional hanzi when used with simplified hanzi"],
	["component", "Some components"],
	["bopomofo", "Bopomofo"],
	["stroke", "Strokes"]
];
qi["ZhHant"] = [
	["t31", "HSK v3 level 1, traditional hanzi"],
	["t32", "HSK v3 level 2, traditional hanzi"],
	["t33", "HSK v3 level 3, traditional hanzi"],
	["tu", "Some other traditional hanzi"],
	["tc", "Some components"]
];

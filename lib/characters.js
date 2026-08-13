// Curated Bible character dataset for the Characters tab (Family Tree + Timeline views).
// This is a representative set of ~170 major and connecting figures across the whole
// Bible, not a literal list of every name in scripture - many genealogies list names
// with no attached story. Easy to extend: add another entry to CHARACTERS below,
// following the same shape.

export const ERAS = [
  { key: "creation", label: "Creation & Early Genesis" },
  { key: "patriarchs", label: "The Patriarchs" },
  { key: "egypt_exodus", label: "Egypt & the Exodus" },
  { key: "judges", label: "The Judges" },
  { key: "united_kingdom", label: "The United Kingdom" },
  { key: "divided_kingdom", label: "The Divided Kingdom" },
  { key: "exile_return", label: "Exile & Return" },
  { key: "gospels", label: "The Gospels" },
  { key: "early_church", label: "The Early Church" },
]

export const CHARACTERS = [
  { id: "adam", name: "Adam", era: "creation", storyGroup: "first_family", generation: 1, parentIds: [], spouseIds: ["eve"], significance: "major", blurb: "The first man, formed by God from the dust and placed in the Garden of Eden. His disobedience with the forbidden fruit brought sin and death into the world." },
  { id: "eve", name: "Eve", era: "creation", storyGroup: "first_family", generation: 1, parentIds: [], spouseIds: ["adam"], significance: "major", blurb: "The first woman, formed from Adam's side and called \"the mother of all the living.\" She was deceived by the serpent and ate the forbidden fruit." },
  { id: "cain", name: "Cain", era: "creation", storyGroup: "first_family", generation: 2, parentIds: ["adam", "eve"], spouseIds: [], significance: "major", blurb: "Adam and Eve's firstborn son, a farmer who murdered his brother Abel out of jealousy after God favored Abel's offering." },
  { id: "abel", name: "Abel", era: "creation", storyGroup: "first_family", generation: 2, parentIds: ["adam", "eve"], spouseIds: [], significance: "major", blurb: "Adam and Eve's second son, a shepherd whose offering pleased God. He was killed by his brother Cain, becoming the Bible's first martyr." },
  { id: "seth", name: "Seth", era: "creation", storyGroup: "first_family", generation: 2, parentIds: ["adam", "eve"], spouseIds: [], significance: "minor", blurb: "Adam and Eve's third son, born after Abel's death. Scripture traces the godly line of humanity through him rather than Cain." },
  { id: "enosh", name: "Enosh", era: "creation", storyGroup: "genealogy", generation: 3, parentIds: ["seth"], spouseIds: [], significance: "minor", blurb: "Son of Seth; his lifetime is remembered as when \"people began to call on the name of the LORD.\"" },
  { id: "kenan", name: "Kenan", era: "creation", storyGroup: "genealogy", generation: 4, parentIds: ["enosh"], spouseIds: [], significance: "minor", blurb: "A descendant of Seth listed in Genesis's genealogy leading toward Noah." },
  { id: "mahalalel", name: "Mahalalel", era: "creation", storyGroup: "genealogy", generation: 5, parentIds: ["kenan"], spouseIds: [], significance: "minor", blurb: "Great-great-grandson of Seth, part of the genealogical line from Adam to Noah." },
  { id: "jared", name: "Jared", era: "creation", storyGroup: "genealogy", generation: 6, parentIds: ["mahalalel"], spouseIds: [], significance: "minor", blurb: "Father of Enoch, one of the long-lived patriarchs before the flood." },
  { id: "enoch", name: "Enoch", era: "creation", storyGroup: "genealogy", generation: 7, parentIds: ["jared"], spouseIds: [], significance: "major", blurb: "A patriarch remembered for walking faithfully with God; Genesis says he \"was no more, because God took him\" without dying." },
  { id: "methuselah", name: "Methuselah", era: "creation", storyGroup: "genealogy", generation: 8, parentIds: ["enoch"], spouseIds: [], significance: "minor", blurb: "The longest-lived person recorded in the Bible, dying at 969 years old, the same year the flood began." },
  { id: "lamech_sethite", name: "Lamech", era: "creation", storyGroup: "genealogy", generation: 9, parentIds: ["methuselah"], spouseIds: [], significance: "minor", blurb: "Father of Noah; he named his son hoping he would bring relief from humanity's hard labor." },
  { id: "noah", name: "Noah", era: "creation", storyGroup: "flood", generation: 10, parentIds: ["lamech_sethite"], spouseIds: ["noahs_wife"], significance: "major", blurb: "Chosen by God to build the ark and preserve his family and the animals through the great flood. Afterward God made a covenant with him, symbolized by the rainbow." },
  { id: "noahs_wife", name: "Noah's Wife", era: "creation", storyGroup: "flood", generation: 10, parentIds: [], spouseIds: ["noah"], significance: "minor", blurb: "Unnamed in scripture, she survived the flood aboard the ark alongside Noah and their three sons and daughters-in-law." },
  { id: "shem", name: "Shem", era: "creation", storyGroup: "flood", generation: 11, parentIds: ["noah"], spouseIds: [], significance: "major", blurb: "Noah's son and ancestor of the Semitic peoples, including Abraham; his line is traced in detail as the genealogy moves toward the patriarchs." },
  { id: "ham", name: "Ham", era: "creation", storyGroup: "flood", generation: 11, parentIds: ["noah"], spouseIds: [], significance: "minor", blurb: "Noah's son, whose disrespect toward his father after the flood led to a curse on his son Canaan's line." },
  { id: "japheth", name: "Japheth", era: "creation", storyGroup: "flood", generation: 11, parentIds: ["noah"], spouseIds: [], significance: "minor", blurb: "Noah's son, traditionally regarded as an ancestor of peoples spreading into Europe and Asia Minor." },
  { id: "nimrod", name: "Nimrod", era: "creation", storyGroup: "babel", generation: 12, parentIds: [], impliedGapFrom: "ham", spouseIds: [], significance: "minor", blurb: "A grandson of Ham (through Cush, not individually listed here) described as \"a mighty hunter before the LORD\" and founder of Babylon and other early cities." },
  { id: "arphaxad", name: "Arphaxad", era: "creation", storyGroup: "genealogy", generation: 12, parentIds: ["shem"], spouseIds: [], significance: "minor", blurb: "Son of Shem, an ancestor of Abraham in the genealogical line recorded in Genesis 11." },
  { id: "shelah", name: "Shelah", era: "creation", storyGroup: "genealogy", generation: 13, parentIds: ["arphaxad"], spouseIds: [], significance: "minor", blurb: "A descendant of Shem in the line leading to Abraham." },
  { id: "eber", name: "Eber", era: "creation", storyGroup: "genealogy", generation: 14, parentIds: ["shelah"], spouseIds: [], significance: "minor", blurb: "An ancestor of Abraham; some connect the term \"Hebrew\" to his name." },
  { id: "peleg", name: "Peleg", era: "creation", storyGroup: "genealogy", generation: 15, parentIds: ["eber"], spouseIds: [], significance: "minor", blurb: "His name means \"division\"; Genesis notes that \"in his time the earth was divided.\"" },
  { id: "reu", name: "Reu", era: "creation", storyGroup: "genealogy", generation: 16, parentIds: ["peleg"], spouseIds: [], significance: "minor", blurb: "A link in the genealogy connecting Shem to Abraham." },
  { id: "serug", name: "Serug", era: "creation", storyGroup: "genealogy", generation: 17, parentIds: ["reu"], spouseIds: [], significance: "minor", blurb: "Great-grandfather of Abraham, listed in the Genesis 11 genealogy." },
  { id: "nahor_elder", name: "Nahor", era: "creation", storyGroup: "genealogy", generation: 18, parentIds: ["serug"], spouseIds: [], significance: "minor", blurb: "Grandfather of Abraham, part of the family line that lived in Ur and Haran." },
  { id: "terah", name: "Terah", era: "creation", storyGroup: "genealogy", generation: 19, parentIds: ["nahor_elder"], spouseIds: [], significance: "minor", blurb: "Abraham's father, who set out from Ur toward Canaan but settled and died in Haran." },
  { id: "abraham", name: "Abraham", era: "patriarchs", storyGroup: "abraham_family", generation: 20, parentIds: ["terah"], spouseIds: ["sarah", "hagar", "keturah"], significance: "major", blurb: "Called by God to leave his homeland for Canaan, he became the father of the Hebrew nation through a covenant promising descendants as numerous as the stars." },
  { id: "sarah", name: "Sarah", era: "patriarchs", storyGroup: "abraham_family", generation: 20, parentIds: [], spouseIds: ["abraham"], significance: "major", blurb: "Abraham's wife, who bore Isaac in her old age after decades of barrenness, fulfilling God's promise." },
  { id: "hagar", name: "Hagar", era: "patriarchs", storyGroup: "abraham_family", generation: 20, parentIds: [], spouseIds: ["abraham"], significance: "minor", blurb: "Sarah's Egyptian servant who bore Ishmael to Abraham and later fled into the wilderness, where God provided for her and her son." },
  { id: "keturah", name: "Keturah", era: "patriarchs", storyGroup: "abraham_family", generation: 20, parentIds: [], spouseIds: ["abraham"], significance: "minor", blurb: "The wife Abraham took after Sarah's death, mother of several sons who became ancestors of Arabian tribes." },
  { id: "ishmael", name: "Ishmael", era: "patriarchs", storyGroup: "abraham_family", generation: 21, parentIds: ["abraham", "hagar"], spouseIds: [], significance: "major", blurb: "Abraham's firstborn son through Hagar; God promised he would also become a great nation, and tradition regards him as an ancestor of the Arab peoples." },
  { id: "isaac", name: "Isaac", era: "patriarchs", storyGroup: "isaac_family", generation: 21, parentIds: ["abraham", "sarah"], spouseIds: ["rebekah"], significance: "major", blurb: "The promised son of Abraham and Sarah, nearly offered as a sacrifice in a test of his father's faith. He inherited God's covenant and fathered Jacob and Esau." },
  { id: "rebekah", name: "Rebekah", era: "patriarchs", storyGroup: "isaac_family", generation: 21, parentIds: [], spouseIds: ["isaac"], significance: "major", blurb: "Isaac's wife, chosen at a well in Abraham's homeland. She favored Jacob and helped him secure Esau's blessing through deception." },
  { id: "esau", name: "Esau", era: "patriarchs", storyGroup: "jacob_family", generation: 22, parentIds: ["isaac", "rebekah"], spouseIds: [], significance: "major", blurb: "Isaac's elder twin, a skilled hunter who sold his birthright to Jacob for a bowl of stew and later reconciled with him after years of estrangement." },
  { id: "jacob", name: "Jacob", era: "patriarchs", storyGroup: "jacob_family", generation: 22, parentIds: ["isaac", "rebekah"], spouseIds: ["leah", "rachel", "bilhah", "zilpah"], significance: "major", blurb: "Isaac's younger twin, renamed Israel after wrestling with God. His twelve sons became the ancestors of the twelve tribes of Israel." },
  { id: "laban", name: "Laban", era: "patriarchs", storyGroup: "jacob_family", generation: 21, parentIds: [], impliedGapFrom: "terah", spouseIds: [], significance: "minor", blurb: "Rebekah's brother, descended from Terah through his son Nahor (Abraham's brother) - Nahor and Bethuel aren't individually listed here. He employed Jacob for many years and repeatedly changed his wages." },
  { id: "leah", name: "Leah", era: "patriarchs", storyGroup: "jacob_family", generation: 22, parentIds: ["laban"], spouseIds: ["jacob"], significance: "major", blurb: "Jacob's first wife, given to him by Laban's trickery. Though less loved than Rachel, she bore six of Jacob's sons, including Judah and Levi." },
  { id: "rachel", name: "Rachel", era: "patriarchs", storyGroup: "jacob_family", generation: 22, parentIds: ["laban"], spouseIds: ["jacob"], significance: "major", blurb: "Jacob's beloved second wife, who was barren for years before bearing Joseph and later dying while giving birth to Benjamin." },
  { id: "bilhah", name: "Bilhah", era: "patriarchs", storyGroup: "jacob_family", generation: 22, parentIds: [], spouseIds: ["jacob"], significance: "minor", blurb: "Rachel's servant, given to Jacob as a wife; she bore Dan and Naphtali." },
  { id: "zilpah", name: "Zilpah", era: "patriarchs", storyGroup: "jacob_family", generation: 22, parentIds: [], spouseIds: ["jacob"], significance: "minor", blurb: "Leah's servant, given to Jacob as a wife; she bore Gad and Asher." },
  { id: "reuben", name: "Reuben", era: "patriarchs", storyGroup: "twelve_tribes", generation: 23, parentIds: ["jacob", "leah"], spouseIds: [], significance: "minor", blurb: "Jacob's firstborn, whose birthright was forfeited after he wronged his father; ancestor of the tribe of Reuben." },
  { id: "simeon", name: "Simeon", era: "patriarchs", storyGroup: "twelve_tribes", generation: 23, parentIds: ["jacob", "leah"], spouseIds: [], significance: "minor", blurb: "Jacob's second son with Leah, notorious for the violent revenge he and Levi took on Shechem." },
  { id: "levi", name: "Levi", era: "patriarchs", storyGroup: "twelve_tribes", generation: 23, parentIds: ["jacob", "leah"], spouseIds: [], significance: "major", blurb: "Jacob's third son with Leah; his descendants became the priestly tribe, including Moses and Aaron." },
  { id: "judah", name: "Judah", era: "patriarchs", storyGroup: "twelve_tribes", generation: 23, parentIds: ["jacob", "leah"], spouseIds: ["tamar_daughterinlaw"], significance: "major", blurb: "Jacob's fourth son with Leah, who proposed selling Joseph rather than killing him. His descendants became the royal tribe, leading to King David and, in Christian belief, Jesus." },
  { id: "dan", name: "Dan", era: "patriarchs", storyGroup: "twelve_tribes", generation: 23, parentIds: ["jacob", "bilhah"], spouseIds: [], significance: "minor", blurb: "Jacob's son through Bilhah, ancestor of the tribe of Dan." },
  { id: "naphtali", name: "Naphtali", era: "patriarchs", storyGroup: "twelve_tribes", generation: 23, parentIds: ["jacob", "bilhah"], spouseIds: [], significance: "minor", blurb: "Jacob's son through Bilhah, ancestor of the tribe of Naphtali." },
  { id: "gad", name: "Gad", era: "patriarchs", storyGroup: "twelve_tribes", generation: 23, parentIds: ["jacob", "zilpah"], spouseIds: [], significance: "minor", blurb: "Jacob's son through Zilpah, ancestor of the tribe of Gad." },
  { id: "asher", name: "Asher", era: "patriarchs", storyGroup: "twelve_tribes", generation: 23, parentIds: ["jacob", "zilpah"], spouseIds: [], significance: "minor", blurb: "Jacob's son through Zilpah, ancestor of the tribe of Asher." },
  { id: "issachar", name: "Issachar", era: "patriarchs", storyGroup: "twelve_tribes", generation: 23, parentIds: ["jacob", "leah"], spouseIds: [], significance: "minor", blurb: "Jacob's fifth son with Leah, ancestor of the tribe of Issachar." },
  { id: "zebulun", name: "Zebulun", era: "patriarchs", storyGroup: "twelve_tribes", generation: 23, parentIds: ["jacob", "leah"], spouseIds: [], significance: "minor", blurb: "Jacob's sixth son with Leah, ancestor of the tribe of Zebulun." },
  { id: "dinah", name: "Dinah", era: "patriarchs", storyGroup: "twelve_tribes", generation: 23, parentIds: ["jacob", "leah"], spouseIds: [], significance: "minor", blurb: "Jacob and Leah's daughter, whose assault by Shechem led her brothers Simeon and Levi to take violent revenge." },
  { id: "joseph_patriarch", name: "Joseph", era: "patriarchs", storyGroup: "joseph_story", generation: 23, parentIds: ["jacob", "rachel"], spouseIds: ["asenath"], significance: "major", blurb: "Jacob's favored son, sold into slavery in Egypt by his jealous brothers. He rose to become second-in-command under Pharaoh and later saved his family from famine." },
  { id: "benjamin", name: "Benjamin", era: "patriarchs", storyGroup: "twelve_tribes", generation: 23, parentIds: ["jacob", "rachel"], spouseIds: [], significance: "minor", blurb: "Jacob's youngest son, born as Rachel died; his tribe later produced King Saul." },
  { id: "potiphar", name: "Potiphar", era: "patriarchs", storyGroup: "joseph_story", generation: 23, parentIds: [], spouseIds: [], significance: "minor", blurb: "The Egyptian official who bought Joseph as a slave; his wife's false accusation sent Joseph to prison." },
  { id: "asenath", name: "Asenath", era: "patriarchs", storyGroup: "joseph_story", generation: 23, parentIds: [], spouseIds: ["joseph_patriarch"], significance: "minor", blurb: "An Egyptian woman given to Joseph in marriage by Pharaoh; mother of Ephraim and Manasseh." },
  { id: "ephraim", name: "Ephraim", era: "patriarchs", storyGroup: "joseph_story", generation: 24, parentIds: ["joseph_patriarch", "asenath"], spouseIds: [], significance: "minor", blurb: "Joseph's younger son, blessed by Jacob ahead of his older brother Manasseh; his tribe became prominent in the northern kingdom." },
  { id: "manasseh_son_of_joseph", name: "Manasseh", era: "patriarchs", storyGroup: "joseph_story", generation: 24, parentIds: ["joseph_patriarch", "asenath"], spouseIds: [], significance: "minor", blurb: "Joseph's elder son, ancestor of the tribe of Manasseh." },
  { id: "tamar_daughterinlaw", name: "Tamar", era: "patriarchs", storyGroup: "joseph_story", generation: 23, parentIds: [], spouseIds: ["judah"], significance: "minor", blurb: "Judah's daughter-in-law, who disguised herself to secure an heir after being denied her rightful place in the family; mother of Perez and Zerah." },
  { id: "perez", name: "Perez", era: "patriarchs", storyGroup: "davidic_line", generation: 24, parentIds: ["judah", "tamar_daughterinlaw"], spouseIds: [], significance: "minor", blurb: "Son of Judah and Tamar, an ancestor of Boaz and, later, King David." },
  { id: "kohath", name: "Kohath", era: "egypt_exodus", storyGroup: "levite_line", generation: 24, parentIds: ["levi"], spouseIds: [], significance: "minor", blurb: "Levi's son, an ancestor of Moses, Aaron, and the priestly Levites." },
  { id: "amram", name: "Amram", era: "egypt_exodus", storyGroup: "levite_line", generation: 25, parentIds: ["kohath"], spouseIds: ["jochebed"], significance: "minor", blurb: "Father of Moses, Aaron, and Miriam, part of the priestly tribe of Levi." },
  { id: "jochebed", name: "Jochebed", era: "egypt_exodus", storyGroup: "levite_line", generation: 25, parentIds: [], spouseIds: ["amram"], significance: "minor", blurb: "Mother of Moses, Aaron, and Miriam, who hid infant Moses in a basket on the Nile to save him from Pharaoh's decree." },
  { id: "moses", name: "Moses", era: "egypt_exodus", storyGroup: "exodus", generation: 26, parentIds: ["amram", "jochebed"], spouseIds: ["zipporah"], significance: "major", blurb: "Raised in Pharaoh's household, he led the Israelites out of slavery in Egypt, received the Ten Commandments at Sinai, and guided the people for forty years in the wilderness." },
  { id: "aaron", name: "Aaron", era: "egypt_exodus", storyGroup: "exodus", generation: 26, parentIds: ["amram", "jochebed"], spouseIds: [], significance: "major", blurb: "Moses's older brother and spokesman before Pharaoh, who became Israel's first high priest." },
  { id: "miriam", name: "Miriam", era: "egypt_exodus", storyGroup: "exodus", generation: 26, parentIds: ["amram", "jochebed"], spouseIds: [], significance: "major", blurb: "Moses and Aaron's sister, a prophetess who led the Israelite women in song after crossing the Red Sea." },
  { id: "zipporah", name: "Zipporah", era: "egypt_exodus", storyGroup: "exodus", generation: 26, parentIds: [], spouseIds: ["moses"], significance: "minor", blurb: "Moses's wife, daughter of the Midianite priest Jethro." },
  { id: "pharaoh_exodus", name: "Pharaoh of the Exodus", era: "egypt_exodus", storyGroup: "exodus", generation: 26, parentIds: [], spouseIds: [], significance: "minor", blurb: "The unnamed Egyptian king who repeatedly refused to free the Israelites despite the ten plagues, until the death of the firstborn broke his resistance." },
  { id: "joshua", name: "Joshua", era: "egypt_exodus", storyGroup: "conquest", generation: 27, parentIds: [], impliedGapFrom: "ephraim", spouseIds: [], significance: "major", blurb: "Moses's assistant and eventual successor, of the tribe of Ephraim (son of Nun - the generations between Ephraim and Nun aren't individually listed). He led Israel across the Jordan and conquered the promised land, including the fall of Jericho." },
  { id: "caleb", name: "Caleb", era: "egypt_exodus", storyGroup: "conquest", generation: 27, parentIds: [], impliedGapFrom: "judah", spouseIds: [], significance: "major", blurb: "One of the twelve spies sent into Canaan, counted with the tribe of Judah (his father Jephunneh isn't individually listed here). Alongside Joshua, he trusted God's promise and was rewarded by living to enter the promised land." },
  { id: "salmon", name: "Salmon", era: "judges", storyGroup: "ruth", generation: 28, parentIds: [], impliedGapFrom: "perez", spouseIds: ["rahab"], significance: "minor", blurb: "A leader of the tribe of Judah, several generations after Perez (Hezron, Ram, Amminadab, and Nahshon fall between them and aren't individually listed). Tradition identifies his wife as Rahab of Jericho, making them Boaz's parents." },
  { id: "rahab", name: "Rahab", era: "judges", storyGroup: "ruth", generation: 28, parentIds: [], spouseIds: ["salmon"], significance: "minor", blurb: "A Canaanite woman of Jericho who hid Israel's spies and was spared when the city fell; she is remembered in the New Testament for her faith and, by tradition, as Boaz's mother." },
  { id: "deborah", name: "Deborah", era: "judges", storyGroup: "judges", generation: 30, parentIds: [], impliedGapFrom: "ephraim", spouseIds: [], significance: "major", blurb: "A prophetess and the only female judge of Israel, associated with the hill country of Ephraim where she held court (Judges 4:5) - the generations connecting her aren't individually listed. She led the nation to victory over the Canaanites alongside the general Barak." },
  { id: "barak", name: "Barak", era: "judges", storyGroup: "judges", generation: 30, parentIds: [], impliedGapFrom: "naphtali", spouseIds: [], significance: "minor", blurb: "The military commander from the tribe of Naphtali (his father Abinoam isn't individually listed here) who, at Deborah's urging, led Israel's army to defeat the Canaanite general Sisera." },
  { id: "gideon", name: "Gideon", era: "judges", storyGroup: "judges", generation: 31, parentIds: [], impliedGapFrom: "manasseh_son_of_joseph", spouseIds: [], significance: "major", blurb: "A judge from the tribe of Manasseh (his father Joash isn't individually listed here) who, with just 300 men, defeated a massive Midianite army after God reduced his forces to prove the victory was the Lord's." },
  { id: "abimelech_gideon", name: "Abimelech", era: "judges", storyGroup: "judges", generation: 32, parentIds: ["gideon"], spouseIds: [], significance: "minor", blurb: "Gideon's son, who murdered his brothers to seize power and ruled briefly and violently before dying in battle." },
  { id: "jephthah", name: "Jephthah", era: "judges", storyGroup: "judges", generation: 32, parentIds: [], impliedGapFrom: "manasseh_son_of_joseph", spouseIds: [], significance: "minor", blurb: "A judge from Gilead, the region settled by Manasseh's line (the generations connecting them aren't individually listed), remembered for a rash vow made before battle that led to great personal tragedy." },
  { id: "samson", name: "Samson", era: "judges", storyGroup: "judges", generation: 33, parentIds: ["manoah"], spouseIds: ["delilah"], significance: "major", blurb: "A judge of immense God-given strength, set apart as a Nazirite from birth, whose downfall came through his relationship with Delilah." },
  { id: "delilah", name: "Delilah", era: "judges", storyGroup: "judges", generation: 33, parentIds: [], spouseIds: ["samson"], significance: "major", blurb: "The Philistine woman who repeatedly pressed Samson until he revealed the secret of his strength, leading to his capture." },
  { id: "manoah", name: "Manoah", era: "judges", storyGroup: "judges", generation: 32, parentIds: [], impliedGapFrom: "dan", spouseIds: [], significance: "minor", blurb: "Samson's father, from the tribe of Dan (the generations connecting them aren't individually listed), visited by an angel who foretold his son's birth and calling." },
  { id: "elimelech", name: "Elimelech", era: "judges", storyGroup: "ruth", generation: 33, parentIds: [], impliedGapFrom: "judah", spouseIds: ["naomi"], significance: "minor", blurb: "Naomi's husband, an Ephrathite of Bethlehem in Judah (the generations connecting him to Judah aren't individually listed), who moved his family to Moab during a famine; he died there, leaving Naomi widowed." },
  { id: "naomi", name: "Naomi", era: "judges", storyGroup: "ruth", generation: 33, parentIds: [], spouseIds: ["elimelech"], significance: "major", blurb: "An Israelite widow who returned from Moab to Bethlehem with her loyal daughter-in-law Ruth, later helping arrange Ruth's marriage to Boaz." },
  { id: "mahlon", name: "Mahlon", era: "judges", storyGroup: "ruth", generation: 34, parentIds: ["elimelech", "naomi"], spouseIds: ["ruth"], significance: "minor", blurb: "Naomi's son and Ruth's first husband, who died in Moab before the story's central events." },
  { id: "ruth", name: "Ruth", era: "judges", storyGroup: "ruth", generation: 34, parentIds: [], spouseIds: ["mahlon", "boaz"], significance: "major", blurb: "A Moabite widow whose devotion to Naomi (\"where you go I will go\") became legendary. Her marriage to Boaz placed her in the direct ancestral line of King David." },
  { id: "boaz", name: "Boaz", era: "judges", storyGroup: "ruth", generation: 29, parentIds: ["salmon"], spouseIds: ["ruth"], significance: "major", blurb: "A wealthy and kind relative of Naomi's family who redeemed Ruth through marriage according to Israelite custom, becoming King David's great-grandfather." },
  { id: "eli", name: "Eli", era: "united_kingdom", storyGroup: "samuel", generation: 34, parentIds: [], impliedGapFrom: "aaron", spouseIds: [], significance: "minor", blurb: "The priest and judge who raised the young Samuel at the tabernacle in Shiloh, from the priestly line of Aaron (through Ithamar - the generations between them aren't individually listed). His own sons' corruption brought judgment on his household." },
  { id: "hannah", name: "Hannah", era: "united_kingdom", storyGroup: "samuel", generation: 34, parentIds: [], spouseIds: ["elkanah"], significance: "major", blurb: "Samuel's mother, who prayed fervently for a child and dedicated her long-awaited son to the Lord's service." },
  { id: "elkanah", name: "Elkanah", era: "united_kingdom", storyGroup: "samuel", generation: 34, parentIds: [], impliedGapFrom: "kohath", spouseIds: ["hannah"], significance: "minor", blurb: "Samuel's father, a Levite descended from Kohath (the same ancestor as Moses and Aaron, through a different, later branch not individually listed here), whose two wives were Hannah and Peninnah." },
  { id: "samuel", name: "Samuel", era: "united_kingdom", storyGroup: "samuel", generation: 35, parentIds: ["elkanah", "hannah"], spouseIds: [], significance: "major", blurb: "Israel's last judge and a major prophet, who anointed both Saul and David as king." },
  { id: "kish", name: "Kish", era: "united_kingdom", storyGroup: "saul_family", generation: 35, parentIds: [], impliedGapFrom: "benjamin", spouseIds: [], significance: "minor", blurb: "A Benjamite (the generations connecting him to Benjamin aren't individually listed) and the father of King Saul." },
  { id: "saul", name: "Saul", era: "united_kingdom", storyGroup: "saul_family", generation: 36, parentIds: ["kish"], spouseIds: [], significance: "major", blurb: "Israel's first king, tall and initially humble, whose disobedience led God to reject his dynasty in favor of David. His reign ended in growing jealousy and tragedy." },
  { id: "jonathan", name: "Jonathan", era: "united_kingdom", storyGroup: "saul_family", generation: 37, parentIds: ["saul"], spouseIds: [], significance: "major", blurb: "Saul's son and heir, whose deep friendship with David led him to protect David from his own father's murderous jealousy." },
  { id: "michal", name: "Michal", era: "united_kingdom", storyGroup: "saul_family", generation: 37, parentIds: ["saul"], spouseIds: ["david"], significance: "minor", blurb: "Saul's daughter, David's first wife, who once saved David's life by helping him escape her father's soldiers." },
  { id: "jesse", name: "Jesse", era: "united_kingdom", storyGroup: "davidic_line", generation: 32, parentIds: ["obed"], spouseIds: [], significance: "minor", blurb: "A Bethlehemite farmer, grandson of Boaz and Ruth, and father of King David." },
  { id: "obed", name: "Obed", era: "united_kingdom", storyGroup: "davidic_line", generation: 31, parentIds: ["boaz", "ruth"], spouseIds: [], significance: "minor", blurb: "Son of Boaz and Ruth, and grandfather of King David." },
  { id: "david", name: "David", era: "united_kingdom", storyGroup: "davidic_line", generation: 33, parentIds: ["jesse"], spouseIds: ["michal", "abigail", "bathsheba"], significance: "major", blurb: "Israel's greatest king, a shepherd who killed Goliath, wrote many of the Psalms, and established Jerusalem as his capital. God promised his throne would endure forever." },
  { id: "abigail", name: "Abigail", era: "united_kingdom", storyGroup: "davidic_line", generation: 33, parentIds: [], spouseIds: ["david"], significance: "minor", blurb: "A wise woman who prevented David from taking violent revenge on her foolish husband Nabal, and later became David's wife." },
  { id: "uriah", name: "Uriah the Hittite", era: "united_kingdom", storyGroup: "davidic_line", generation: 33, parentIds: [], spouseIds: ["bathsheba"], significance: "minor", blurb: "A loyal soldier in David's army, Bathsheba's husband, whom David had killed in battle to cover up his affair with her." },
  { id: "bathsheba", name: "Bathsheba", era: "united_kingdom", storyGroup: "davidic_line", generation: 33, parentIds: [], spouseIds: ["uriah", "david"], significance: "major", blurb: "David's wife, whose affair with him while married to Uriah led to tragedy, but whose son Solomon became David's successor." },
  { id: "nathan_prophet", name: "Nathan", era: "united_kingdom", storyGroup: "davidic_line", generation: 33, parentIds: [], spouseIds: [], significance: "minor", blurb: "The prophet who confronted David over his sin with Bathsheba through a memorable parable, and who later helped ensure Solomon's succession." },
  { id: "joab", name: "Joab", era: "united_kingdom", storyGroup: "davidic_line", generation: 33, parentIds: [], impliedGapFrom: "jesse", spouseIds: [], significance: "minor", blurb: "David's ruthless and loyal military commander, son of David's sister Zeruiah (Jesse's daughter, not individually listed here) - making him David's nephew - throughout much of his reign." },
  { id: "absalom", name: "Absalom", era: "united_kingdom", storyGroup: "davidic_line", generation: 34, parentIds: ["david"], spouseIds: [], significance: "major", blurb: "David's handsome and rebellious son, who led an uprising against his own father and was killed while fleeing, causing David great grief." },
  { id: "amnon", name: "Amnon", era: "united_kingdom", storyGroup: "davidic_line", generation: 34, parentIds: ["david"], spouseIds: [], significance: "minor", blurb: "David's eldest son, whose crime against his half-sister Tamar led to his murder by her brother Absalom." },
  { id: "tamar_davids_daughter", name: "Tamar", era: "united_kingdom", storyGroup: "davidic_line", generation: 34, parentIds: ["david"], spouseIds: [], significance: "minor", blurb: "David's daughter, assaulted by her half-brother Amnon, an event that fractured David's family." },
  { id: "solomon", name: "Solomon", era: "united_kingdom", storyGroup: "davidic_line", generation: 34, parentIds: ["david", "bathsheba"], spouseIds: [], significance: "major", blurb: "David's son and successor, renowned for his God-given wisdom, vast wealth, and building of the first Jerusalem Temple. His later idolatry contributed to the kingdom's eventual division." },
  { id: "rehoboam", name: "Rehoboam", era: "divided_kingdom", storyGroup: "judah_kings", generation: 35, parentIds: ["solomon"], spouseIds: [], significance: "minor", blurb: "Solomon's son, whose harsh policies caused the ten northern tribes to revolt, splitting the kingdom into Israel and Judah." },
  { id: "jeroboam", name: "Jeroboam", era: "divided_kingdom", storyGroup: "israel_kings", generation: 35, parentIds: [], impliedGapFrom: "ephraim", spouseIds: [], significance: "minor", blurb: "The first king of the northern kingdom of Israel after the split, an Ephraimite (his father Nebat isn't individually listed here) remembered for setting up golden calves that led the nation into idolatry." },
  { id: "ahab", name: "Ahab", era: "divided_kingdom", storyGroup: "israel_kings", generation: 38, parentIds: [], spouseIds: ["jezebel"], significance: "major", blurb: "A king of Israel notorious for promoting Baal worship under his wife Jezebel's influence, and for his frequent conflicts with the prophet Elijah." },
  { id: "jezebel", name: "Jezebel", era: "divided_kingdom", storyGroup: "israel_kings", generation: 38, parentIds: [], spouseIds: ["ahab"], significance: "major", blurb: "Ahab's Phoenician wife, who aggressively promoted Baal worship and persecuted the Lord's prophets, becoming a byword for wickedness." },
  { id: "naboth", name: "Naboth", era: "divided_kingdom", storyGroup: "israel_kings", generation: 38, parentIds: [], impliedGapFrom: "issachar", spouseIds: [], significance: "minor", blurb: "\"Naboth the Jezreelite\" (1 Kings 21:1) - Jezreel lay in the territory of Issachar (the generations connecting him aren't individually listed). Ahab coveted his vineyard, and Jezebel had him falsely accused and executed to seize it." },
  { id: "elijah", name: "Elijah", era: "divided_kingdom", storyGroup: "prophets", generation: 38, parentIds: [], impliedGapFrom: "manasseh_son_of_joseph", spouseIds: [], significance: "major", blurb: "\"The Tishbite, of Tishbe in Gilead\" (1 Kings 17:1) - Gilead was settled by Manasseh's line (the generations connecting him aren't individually listed). A fiery prophet who confronted Ahab and Jezebel, defeated the prophets of Baal at Mount Carmel, and was taken up to heaven in a whirlwind." },
  { id: "elisha", name: "Elisha", era: "divided_kingdom", storyGroup: "prophets", generation: 39, parentIds: [], impliedGapFrom: "issachar", spouseIds: [], significance: "major", blurb: "Elijah's successor, from Abel Meholah in the territory of Issachar (the generations connecting him aren't individually listed), who received a double portion of his mentor's spirit and performed numerous miracles during the reigns of several kings." },
  { id: "jehu", name: "Jehu", era: "divided_kingdom", storyGroup: "israel_kings", generation: 39, parentIds: [], spouseIds: [], significance: "minor", blurb: "Anointed by Elisha's instruction to overthrow Ahab's dynasty; known for his furious chariot-driving and his purge of Baal worship." },
  { id: "asa", name: "Asa", era: "divided_kingdom", storyGroup: "judah_kings", generation: 37, parentIds: [], impliedGapFrom: "rehoboam", spouseIds: [], significance: "minor", blurb: "A king of Judah, grandson of Rehoboam (his father Abijam isn't individually listed here), remembered for his early religious reforms removing idols from the land." },
  { id: "jehoshaphat", name: "Jehoshaphat", era: "divided_kingdom", storyGroup: "judah_kings", generation: 38, parentIds: ["asa"], spouseIds: [], significance: "minor", blurb: "A king of Judah known for his faithfulness and for allying, controversially, with the northern kingdom's King Ahab." },
  { id: "hezekiah", name: "Hezekiah", era: "divided_kingdom", storyGroup: "judah_kings", generation: 46, parentIds: [], impliedGapFrom: "jehoshaphat", spouseIds: [], significance: "major", blurb: "A reforming king of Judah, several generations after Jehoshaphat (Jehoram, Ahaziah, Joash, Amaziah, Uzziah, Jotham, and Ahaz fall between them and aren't individually listed). He trusted God during the Assyrian siege of Jerusalem, and his prayer extended his life by fifteen years." },
  { id: "isaiah", name: "Isaiah", era: "divided_kingdom", storyGroup: "prophets", generation: 46, parentIds: [], impliedGapFrom: "judah", spouseIds: [], significance: "major", blurb: "A major prophet during the reigns of several kings of Judah - Jewish tradition holds his father Amoz was of the royal line of Judah, though the generations connecting them aren't individually listed. His writings contain some of the Bible's clearest prophecies about the coming Messiah." },
  { id: "manasseh_king", name: "Manasseh", era: "divided_kingdom", storyGroup: "judah_kings", generation: 47, parentIds: ["hezekiah"], spouseIds: [], significance: "minor", blurb: "A king of Judah whose long reign began in great wickedness but who repented after being taken captive to Babylon." },
  { id: "josiah", name: "Josiah", era: "divided_kingdom", storyGroup: "judah_kings", generation: 49, parentIds: [], impliedGapFrom: "manasseh_king", spouseIds: [], significance: "major", blurb: "A young king of Judah, grandson of Manasseh (his father Amon isn't individually listed here), who led a major religious reform after the Book of the Law was rediscovered in the Temple during his reign." },
  { id: "jeremiah", name: "Jeremiah", era: "divided_kingdom", storyGroup: "prophets", generation: 49, parentIds: [], impliedGapFrom: "aaron", spouseIds: [], significance: "major", blurb: "The \"weeping prophet,\" a priest of Anathoth descended from Aaron (the generations between them aren't individually listed), who warned Judah of coming judgment for decades and witnessed Jerusalem's fall to Babylon." },
  { id: "baruch", name: "Baruch", era: "divided_kingdom", storyGroup: "prophets", generation: 49, parentIds: [], impliedGapFrom: "judah", spouseIds: [], significance: "minor", blurb: "Jeremiah's faithful scribe, from a prominent family of Judah (his brother Seraiah held a royal court position - the generations connecting them aren't individually listed), who recorded and read aloud the prophet's warnings." },
  { id: "nebuchadnezzar", name: "Nebuchadnezzar", era: "exile_return", storyGroup: "babylon", generation: 50, parentIds: [], spouseIds: [], significance: "minor", blurb: "The Babylonian king who destroyed Jerusalem and the Temple, took the Israelites into exile, and later came to acknowledge God's sovereignty after a period of humbling." },
  { id: "daniel", name: "Daniel", era: "exile_return", storyGroup: "babylon", generation: 51, parentIds: [], impliedGapFrom: "judah", spouseIds: [], significance: "major", blurb: "A young Israelite exile of Judah's nobility (the generations connecting him aren't individually listed) who rose to prominence in the Babylonian and Persian courts through wisdom and faithfulness, famously surviving a night in a lions' den." },
  { id: "shadrach_meshach_abednego", name: "Shadrach, Meshach & Abednego", era: "exile_return", storyGroup: "babylon", generation: 51, parentIds: [], impliedGapFrom: "judah", spouseIds: [], significance: "minor", blurb: "Daniel's three companions in exile, also of Judah's nobility (the generations connecting them aren't individually listed), who were thrown into a fiery furnace for refusing to worship a golden image and were miraculously preserved." },
  { id: "ezekiel", name: "Ezekiel", era: "exile_return", storyGroup: "babylon", generation: 51, parentIds: [], impliedGapFrom: "aaron", spouseIds: [], significance: "major", blurb: "A priest-turned-prophet among the exiles in Babylon, descended from Aaron (the generations between them aren't individually listed), known for vivid visions including the valley of dry bones." },
  { id: "ahasuerus", name: "Ahasuerus", era: "exile_return", storyGroup: "esther", generation: 52, parentIds: [], spouseIds: ["esther"], significance: "minor", blurb: "The Persian king (often identified with Xerxes I) who made Esther his queen, setting the stage for her role in saving her people." },
  { id: "esther", name: "Esther", era: "exile_return", storyGroup: "esther", generation: 52, parentIds: [], impliedGapFrom: "kish", spouseIds: ["ahasuerus"], significance: "major", blurb: "A Jewish woman of Benjamin, cousin to Mordecai and descended from the same Kish who fathered King Saul (the generations connecting them aren't individually listed), who became queen of Persia and courageously risked her life to expose a plot to destroy her people, saving them from genocide." },
  { id: "mordecai", name: "Mordecai", era: "exile_return", storyGroup: "esther", generation: 52, parentIds: [], impliedGapFrom: "kish", spouseIds: [], significance: "major", blurb: "Esther's older cousin and guardian, a Benjamite descended from the same Kish who fathered King Saul (the generations between them aren't individually listed). He raised Esther and uncovered the plot against the Jewish people that she ultimately foiled." },
  { id: "haman", name: "Haman", era: "exile_return", storyGroup: "esther", generation: 52, parentIds: [], spouseIds: [], significance: "minor", blurb: "A Persian official whose hatred of Mordecai led him to plot the destruction of all Jews in the empire, a plot that ultimately destroyed him instead." },
  { id: "zerubbabel", name: "Zerubbabel", era: "exile_return", storyGroup: "return", generation: 52, parentIds: [], impliedGapFrom: "josiah", spouseIds: [], significance: "major", blurb: "A descendant of David and of King Josiah (Jehoiakim, Jeconiah, and Shealtiel fall between them and aren't individually listed), who led the first group of exiles back to Jerusalem and oversaw the rebuilding of the Temple." },
  { id: "ezra", name: "Ezra", era: "exile_return", storyGroup: "return", generation: 53, parentIds: [], impliedGapFrom: "aaron", spouseIds: [], significance: "major", blurb: "A priest and scribe descended from Aaron (his own genealogy in Ezra 7 lists the generations between them, not individually included here) who led a later group of exiles back to Jerusalem and worked to restore faithfulness to God's law among the people." },
  { id: "nehemiah", name: "Nehemiah", era: "exile_return", storyGroup: "return", generation: 53, parentIds: [], impliedGapFrom: "judah", spouseIds: [], significance: "major", blurb: "A Jewish official in the Persian court, part of the Judean exile community (the generations connecting him to Judah aren't individually listed), who returned to Jerusalem to rebuild its broken walls despite fierce opposition." },
  { id: "zechariah_priest", name: "Zechariah", era: "gospels", storyGroup: "jesus_birth", generation: 58, parentIds: [], impliedGapFrom: "aaron", spouseIds: ["elizabeth"], significance: "minor", blurb: "A priest of the priestly division of Abijah, descended from Aaron (the generations between them aren't individually listed), struck mute for doubting the angel Gabriel's announcement that his elderly wife Elizabeth would bear a son, John the Baptist." },
  { id: "elizabeth", name: "Elizabeth", era: "gospels", storyGroup: "jesus_birth", generation: 58, parentIds: [], impliedGapFrom: "aaron", spouseIds: ["zechariah_priest"], significance: "minor", blurb: "John the Baptist's mother and a relative of Mary, herself \"one of the daughters of Aaron\" (Luke 1:5) - the generations between them aren't individually listed. Her own miraculous pregnancy in old age prefigured the announcement to Mary." },
  { id: "john_the_baptist", name: "John the Baptist", era: "gospels", storyGroup: "jesus_birth", generation: 59, parentIds: ["zechariah_priest", "elizabeth"], spouseIds: [], significance: "major", blurb: "Jesus's forerunner, who preached repentance in the wilderness and baptized Jesus in the Jordan River before being executed by Herod." },
  { id: "joseph_husband_of_mary", name: "Joseph", era: "gospels", storyGroup: "jesus_birth", generation: 59, parentIds: [], impliedGapFrom: "zerubbabel", spouseIds: ["mary_mother_of_jesus"], significance: "major", blurb: "Mary's husband, a carpenter of Bethlehem descended from David and from Zerubbabel (roughly a dozen more generations fall between them and aren't individually listed). He raised Jesus as his own son and protected the family by fleeing to Egypt." },
  { id: "mary_mother_of_jesus", name: "Mary", era: "gospels", storyGroup: "jesus_birth", generation: 59, parentIds: [], spouseIds: ["joseph_husband_of_mary"], significance: "major", blurb: "The young woman chosen to be the mother of Jesus, who accepted the angel Gabriel's astonishing announcement with humble faith." },
  { id: "jesus", name: "Jesus", era: "gospels", storyGroup: "jesus_ministry", generation: 60, parentIds: ["joseph_husband_of_mary", "mary_mother_of_jesus"], spouseIds: [], significance: "major", blurb: "Central to Christian faith as the Son of God, born in Bethlehem, who taught, healed, was crucified, and, Christians believe, rose from the dead." },
  { id: "peter", name: "Peter", era: "gospels", storyGroup: "apostles", generation: 60, parentIds: [], spouseIds: [], significance: "major", blurb: "A fisherman called by Jesus to be an apostle, prominent among the twelve, who denied Jesus three times but later became a leading voice in the early church." },
  { id: "andrew", name: "Andrew", era: "gospels", storyGroup: "apostles", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "Peter's brother and one of the first disciples called by Jesus." },
  { id: "james_son_of_zebedee", name: "James (son of Zebedee)", era: "gospels", storyGroup: "apostles", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "One of the twelve apostles, part of Jesus's inner circle with Peter and John; the first apostle martyred, according to Acts." },
  { id: "john_apostle", name: "John", era: "gospels", storyGroup: "apostles", generation: 60, parentIds: [], spouseIds: [], significance: "major", blurb: "One of the twelve apostles, part of Jesus's inner circle, traditionally credited with writing a Gospel, three epistles, and Revelation." },
  { id: "philip_apostle", name: "Philip", era: "gospels", storyGroup: "apostles", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "One of the twelve apostles, who brought Nathanael to meet Jesus." },
  { id: "bartholomew", name: "Bartholomew", era: "gospels", storyGroup: "apostles", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "One of the twelve apostles, often identified with Nathanael." },
  { id: "thomas", name: "Thomas", era: "gospels", storyGroup: "apostles", generation: 60, parentIds: [], spouseIds: [], significance: "major", blurb: "One of the twelve apostles, remembered for doubting the resurrection until he saw Jesus's wounds himself." },
  { id: "matthew", name: "Matthew", era: "gospels", storyGroup: "apostles", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "A tax collector called by Jesus to be an apostle, traditionally credited as the author of the Gospel of Matthew." },
  { id: "james_son_of_alphaeus", name: "James (son of Alphaeus)", era: "gospels", storyGroup: "apostles", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "One of the twelve apostles, sometimes called \"James the Less.\"" },
  { id: "thaddaeus", name: "Thaddaeus", era: "gospels", storyGroup: "apostles", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "One of the twelve apostles, also called Judas son of James." },
  { id: "simon_the_zealot", name: "Simon the Zealot", era: "gospels", storyGroup: "apostles", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "One of the twelve apostles, identified by his former association with the Zealot movement." },
  { id: "judas_iscariot", name: "Judas Iscariot", era: "gospels", storyGroup: "apostles", generation: 60, parentIds: [], spouseIds: [], significance: "major", blurb: "One of the twelve apostles, who betrayed Jesus to the religious authorities for thirty pieces of silver." },
  { id: "mary_magdalene", name: "Mary Magdalene", era: "gospels", storyGroup: "women_disciples", generation: 60, parentIds: [], spouseIds: [], significance: "major", blurb: "A devoted follower of Jesus, freed from affliction by him, who was the first to see him alive after the resurrection." },
  { id: "martha", name: "Martha", era: "gospels", storyGroup: "bethany_family", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "Sister of Mary and Lazarus of Bethany, remembered for being distracted by hospitality while her sister sat listening to Jesus." },
  { id: "mary_of_bethany", name: "Mary (of Bethany)", era: "gospels", storyGroup: "bethany_family", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "Sister of Martha and Lazarus, who anointed Jesus's feet with costly perfume shortly before his death." },
  { id: "lazarus", name: "Lazarus", era: "gospels", storyGroup: "bethany_family", generation: 60, parentIds: [], spouseIds: [], significance: "major", blurb: "Martha and Mary's brother, whom Jesus famously raised from the dead after four days in the tomb." },
  { id: "nicodemus", name: "Nicodemus", era: "gospels", storyGroup: "other_gospel", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "A Pharisee and member of the Jewish ruling council who visited Jesus by night and later helped prepare his body for burial." },
  { id: "pontius_pilate", name: "Pontius Pilate", era: "gospels", storyGroup: "other_gospel", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "The Roman governor of Judea who, under pressure from religious leaders and the crowd, authorized Jesus's crucifixion." },
  { id: "herod_antipas", name: "Herod Antipas", era: "gospels", storyGroup: "other_gospel", generation: 60, parentIds: [], spouseIds: [], significance: "minor", blurb: "The Roman-appointed ruler of Galilee who had John the Baptist executed and questioned Jesus before his crucifixion." },
  { id: "paul", name: "Paul", era: "early_church", storyGroup: "paul_ministry", generation: 61, parentIds: [], spouseIds: [], significance: "major", blurb: "Once a persecutor of Christians (as Saul of Tarsus), he was dramatically converted on the road to Damascus and became the early church's most influential missionary, writing much of the New Testament." },
  { id: "barnabas", name: "Barnabas", era: "early_church", storyGroup: "paul_ministry", generation: 61, parentIds: [], spouseIds: [], significance: "major", blurb: "An early church leader who vouched for the newly converted Paul and became his missionary partner on his first journey." },
  { id: "stephen", name: "Stephen", era: "early_church", storyGroup: "early_church", generation: 61, parentIds: [], spouseIds: [], significance: "major", blurb: "One of the first deacons in the early church, and its first martyr, stoned to death after a bold speech before the Jewish council." },
  { id: "philip_evangelist", name: "Philip the Evangelist", era: "early_church", storyGroup: "early_church", generation: 61, parentIds: [], spouseIds: [], significance: "minor", blurb: "One of the first deacons, who preached in Samaria and famously explained scripture to an Ethiopian official on a desert road." },
  { id: "timothy", name: "Timothy", era: "early_church", storyGroup: "paul_ministry", generation: 62, parentIds: [], spouseIds: [], significance: "minor", blurb: "A young protege of Paul, raised by a faithful mother and grandmother, who received two personal letters from Paul now in the New Testament." },
  { id: "titus", name: "Titus", era: "early_church", storyGroup: "paul_ministry", generation: 62, parentIds: [], spouseIds: [], significance: "minor", blurb: "A Gentile companion of Paul who helped lead the church in Crete and received a New Testament letter from him." },
  { id: "priscilla_aquila", name: "Priscilla & Aquila", era: "early_church", storyGroup: "early_church", generation: 61, parentIds: [], spouseIds: [], significance: "minor", blurb: "A husband-and-wife team who worked alongside Paul and helped instruct the eloquent preacher Apollos more accurately in the faith." },
  { id: "silas", name: "Silas", era: "early_church", storyGroup: "paul_ministry", generation: 61, parentIds: [], spouseIds: [], significance: "minor", blurb: "A leader in the Jerusalem church who accompanied Paul on his second missionary journey, imprisoned with him in Philippi." },
  { id: "luke_evangelist", name: "Luke", era: "early_church", storyGroup: "early_church", generation: 61, parentIds: [], spouseIds: [], significance: "minor", blurb: "A physician and companion of Paul, traditionally credited as the author of the Gospel of Luke and the Book of Acts." },
  { id: "mark_evangelist", name: "Mark", era: "early_church", storyGroup: "early_church", generation: 61, parentIds: [], spouseIds: [], significance: "minor", blurb: "A younger companion of Paul and Barnabas, traditionally credited as the author of the Gospel of Mark, closely associated with Peter's preaching." },
  { id: "james_brother_of_jesus", name: "James (brother of Jesus)", era: "early_church", storyGroup: "early_church", generation: 60, parentIds: ["mary_mother_of_jesus"], spouseIds: [], significance: "major", blurb: "Jesus's half-brother, who became a leading figure in the Jerusalem church and wrote the New Testament letter bearing his name." },
  { id: "john_of_patmos", name: "John of Patmos", era: "early_church", storyGroup: "early_church", generation: 61, parentIds: [], spouseIds: [], significance: "minor", blurb: "Traditionally identified with the apostle John, exiled on the island of Patmos, where he received the visions recorded in Revelation." },
]

// --- helpers -----------------------------------------------------------

export function getCharacter(id) {
  return CHARACTERS.find((c) => c.id === id) || null
}

export function getChildren(id) {
  return CHARACTERS.filter((c) => c.parentIds.includes(id))
}

export function getParents(id) {
  const c = getCharacter(id)
  if (!c) return []
  return c.parentIds.map((pid) => getCharacter(pid)).filter(Boolean)
}

export function getSpouses(id) {
  const c = getCharacter(id)
  if (!c) return []
  return c.spouseIds.map((sid) => getCharacter(sid)).filter(Boolean)
}

// Family-tree layout: characters are grouped into rows by `generation`.
//
// Two ideas drive the x-position of every node:
//  1. CHILDREN are centered under the midpoint of their actual parent(s)'
//     x position, not just spaced left-to-right in source order. This is
//     what keeps a straight single-child lineage (e.g. Seth -> Enosh ->
//     Kenan -> ...) visually under Seth instead of drifting under Cain.
//  2. MARRIED COUPLES are kept together as a unit. For every couple, one
//     side is picked as the "anchor" (whoever has more spouses recorded,
//     tie-broken by who appears first in CHARACTERS) and is positioned
//     normally by parentage; every other spouse is attached directly
//     beside the anchor, alternating right/left in the order they're
//     listed in the anchor's spouseIds. That alternation is what puts a
//     second-listed spouse (e.g. Hagar, listed after Sarah on Abraham) on
//     the anchor's LEFT rather than tacked on far to the right.
// A final per-row pass enforces a minimum gap between neighbors so the
// two rules above can never produce overlapping nodes.
export function layoutTree(characters) {
  const byId = {}
  characters.forEach((c) => { byId[c.id] = c })
  const idSet = new Set(characters.map((c) => c.id))

  const byGen = {}
  characters.forEach((c) => {
    if (!byGen[c.generation]) byGen[c.generation] = []
    byGen[c.generation].push(c)
  })
  const gens = Object.keys(byGen).map(Number).sort((a, b) => a - b)

  // --- pick an anchor for every married couple -------------------------
  const globalIndex = {}
  CHARACTERS.forEach((c, i) => { globalIndex[c.id] = i })
  const attachedTo = {} // attachedId -> anchorId
  characters.forEach((c) => {
    c.spouseIds.forEach((sid) => {
      if (!idSet.has(sid) || sid === c.id) return
      const s = byId[sid]
      if (!s) return
      if (attachedTo[c.id] || attachedTo[sid]) return // pair already resolved
      const wA = c.spouseIds.filter((x) => idSet.has(x)).length
      const wB = s.spouseIds.filter((x) => idSet.has(x)).length
      const anchor = wA !== wB
        ? (wA > wB ? c.id : sid)
        : (globalIndex[c.id] <= globalIndex[sid] ? c.id : sid)
      const attached = anchor === c.id ? sid : c.id
      attachedTo[attached] = anchor
    })
  })

  // offsets (in slots, relative to the anchor) for each of the anchor's
  // spouses: 1st -> right 1, 2nd -> left 1, 3rd -> right 2, 4th -> left 2...
  function spouseOffsets(anchorId) {
    const anchor = byId[anchorId]
    const offsets = {}
    if (!anchor) return offsets
    let r = 0, l = 0
    anchor.spouseIds.forEach((sid, i) => {
      if (!idSet.has(sid)) return
      if (i % 2 === 0) { r += 1; offsets[sid] = r } else { l += 1; offsets[sid] = -l }
    })
    return offsets
  }

  const slotX = {}

  gens.forEach((gen) => {
    const row = byGen[gen]
    const selfPlaced = row.filter((c) => !attachedTo[c.id])
    const attachedRow = row.filter((c) => attachedTo[c.id])

    // group self-placed nodes into sibling clusters by their exact set of
    // (already-positioned) parents, so a whole sibling group can be
    // centered under its parents' midpoint as a single block. A node with
    // no listed parentIds but an `impliedGapFrom` ancestor (used when
    // several real generations weren't individually curated - e.g. Salmon
    // several generations after Perez) is centered under that ancestor
    // too, just via its own single-node "cluster" so it doesn't look like
    // it appeared at random.
    const clusters = {}
    const orphans = []
    selfPlaced.forEach((c) => {
      let knownParents = c.parentIds.filter((pid) => slotX[pid] !== undefined)
      let gapKey = null
      if (knownParents.length === 0 && c.impliedGapFrom && slotX[c.impliedGapFrom] !== undefined) {
        knownParents = [c.impliedGapFrom]
        gapKey = `GAP:${c.impliedGapFrom}:${c.id}`
      }
      if (knownParents.length > 0) {
        const key = gapKey || knownParents.slice().sort().join('|')
        if (!clusters[key]) {
          const targetX = knownParents.reduce((sum, pid) => sum + slotX[pid], 0) / knownParents.length
          clusters[key] = { ids: [], targetX }
        }
        clusters[key].ids.push(c.id)
      } else {
        orphans.push(c.id) // unconnected figures (judges, apostles, etc.)
      }
    })

    const clusterKeys = Object.keys(clusters).sort((a, b) => clusters[a].targetX - clusters[b].targetX)
    let cursor = 0
    let any = false
    clusterKeys.forEach((key) => {
      const cl = clusters[key]
      const n = cl.ids.length
      let start = cl.targetX - (n - 1) / 2
      if (any && start < cursor) start = cursor
      cl.ids.forEach((id, i) => { slotX[id] = start + i })
      cursor = start + n
      any = true
    })
    orphans.forEach((id) => {
      slotX[id] = cursor
      cursor += 1
      any = true
    })

    // attach spouses beside their anchor (covers the common case where
    // both halves of a couple share a generation row)
    attachedRow.forEach((c) => {
      const anchorId = attachedTo[c.id]
      if (slotX[anchorId] === undefined) return // anchor lands in a later row, handled below
      const offsets = spouseOffsets(anchorId)
      slotX[c.id] = slotX[anchorId] + (offsets[c.id] ?? 1)
    })
  })

  // second pass: attach any spouse whose anchor only got positioned in a
  // later row than their own
  characters.forEach((c) => {
    if (slotX[c.id] !== undefined) return
    const anchorId = attachedTo[c.id]
    if (anchorId && slotX[anchorId] !== undefined) {
      const offsets = spouseOffsets(anchorId)
      slotX[c.id] = slotX[anchorId] + (offsets[c.id] ?? 1)
    }
  })
  // fallback for anything still unplaced (shouldn't normally happen)
  characters.forEach((c) => { if (slotX[c.id] === undefined) slotX[c.id] = 0 })

  // final collision guard: within each generation row, enforce a minimum
  // gap of 1 slot between neighbors so attachment offsets can never
  // visually overlap a neighboring cluster or orphan.
  gens.forEach((gen) => {
    const row = byGen[gen].slice().sort((a, b) => slotX[a.id] - slotX[b.id])
    for (let i = 1; i < row.length; i++) {
      if (slotX[row[i].id] < slotX[row[i - 1].id] + 1) {
        slotX[row[i].id] = slotX[row[i - 1].id] + 1
      }
    }
  })

  const minSlot = Math.min(0, ...characters.map((c) => slotX[c.id]))
  const genIndex = {}
  gens.forEach((g, i) => { genIndex[g] = i })

  const NODE_GAP = 170
  const positions = {}
  characters.forEach((c) => {
    positions[c.id] = { x: (slotX[c.id] - minSlot) * NODE_GAP, y: genIndex[c.generation] * 150 }
  })
  return positions
}

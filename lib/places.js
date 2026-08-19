// Curated Bible locations dataset for the Map tab and for the clickable
// place-name links shown inside verse text. This is a representative set
// of ~130 major, frequently-mentioned locations - not a literal list of
// every place name in scripture (many are one-off genealogical references
// with no securely identified modern site). Easy to extend: add another
// entry below, following the same shape.
//
// Coordinates are the best-supported modern/archaeological identification
// for each site; a handful (marked in the blurb) are traditional or
// disputed identifications rather than settled fact.
//
// aliases: alternate names/spellings that should also link to this place
// when they appear in verse text. Keep aliases distinctive - avoid plain
// English words that would cause false-positive links.

export const PLACES = [
  // Genesis / the Patriarchs
  { id: "eden", name: "Garden of Eden", aliases: [], lat: 31.0, lng: 47.4, blurb: "Traditionally placed near the Tigris and Euphrates in southern Mesopotamia, though its exact location is not known with certainty." },
  { id: "ararat", name: "Mount Ararat", aliases: [], lat: 39.7019, lng: 44.2983, blurb: "The mountain where Noah's ark came to rest after the flood waters receded." },
  { id: "babel_babylon", name: "Babylon", aliases: ["Babel"], lat: 32.5364, lng: 44.4208, blurb: "Site of the Tower of Babel and later the capital of the empire that conquered Judah and exiled its people." },
  { id: "ur", name: "Ur", aliases: ["Ur of the Chaldeans"], lat: 30.9626, lng: 46.1033, blurb: "Abraham's birthplace in southern Mesopotamia before his family migrated toward Canaan." },
  { id: "haran", name: "Haran", aliases: [], lat: 36.8667, lng: 39.0333, blurb: "Where Abraham's family settled on the way from Ur, and where he was called to continue on to Canaan." },
  { id: "shechem", name: "Shechem", aliases: [], lat: 32.2211, lng: 35.2544, blurb: "An early stop for Abraham in Canaan, later the site of Joshua's covenant renewal." },
  { id: "bethel", name: "Bethel", aliases: [], lat: 31.9300, lng: 35.2380, blurb: "Where Jacob dreamed of a stairway to heaven; later a center of worship in the northern kingdom." },
  { id: "hebron", name: "Hebron", aliases: ["Kiriath-arba"], lat: 31.5326, lng: 35.0998, blurb: "Burial place of Abraham, Isaac, and Jacob, and David's first capital before Jerusalem." },
  { id: "mamre", name: "Mamre", aliases: [], lat: 31.5642, lng: 35.1042, blurb: "Near Hebron, where Abraham camped and welcomed three visitors who foretold Isaac's birth." },
  { id: "sodom", name: "Sodom", aliases: [], lat: 31.0, lng: 35.4, blurb: "One of the cities of the plain destroyed for its wickedness; the exact site near the Dead Sea is debated." },
  { id: "gomorrah", name: "Gomorrah", aliases: [], lat: 31.05, lng: 35.45, blurb: "Destroyed alongside Sodom; its precise location near the southern Dead Sea is not certain." },
  { id: "zoar", name: "Zoar", aliases: [], lat: 31.0, lng: 35.55, blurb: "The small city Lot fled to when Sodom and Gomorrah were destroyed." },
  { id: "beersheba", name: "Beersheba", aliases: ["Beer-sheba"], lat: 31.2518, lng: 34.7913, blurb: "A well-site associated with Abraham and Isaac, marking the traditional southern edge of Israel (\"from Dan to Beersheba\")." },
  { id: "gerar", name: "Gerar", aliases: [], lat: 31.3903, lng: 34.5872, blurb: "A Philistine city where both Abraham and Isaac sojourned and had dealings with King Abimelech." },
  { id: "moriah", name: "Mount Moriah", aliases: [], lat: 31.7780, lng: 35.2354, blurb: "Where Abraham was tested with the offering of Isaac; later identified with Jerusalem's Temple Mount." },
  { id: "peniel", name: "Peniel", aliases: ["Penuel"], lat: 32.35, lng: 35.6, blurb: "Where Jacob wrestled with God and was renamed Israel." },
  { id: "succoth", name: "Succoth", aliases: [], lat: 32.1875, lng: 35.6217, blurb: "Where Jacob built shelters for his livestock after leaving Peniel, in the Jordan Valley." },

  // Egypt / Exodus / Wilderness
  { id: "goshen", name: "Goshen", aliases: [], lat: 30.7, lng: 31.9, blurb: "The fertile Nile Delta region given to Jacob's family, where the Israelites settled and multiplied." },
  { id: "rameses", name: "Rameses", aliases: ["Pi-Ramesses"], lat: 30.7889, lng: 31.8367, blurb: "A store city built by Israelite slave labor and the traditional starting point of the Exodus." },
  { id: "pithom", name: "Pithom", aliases: [], lat: 30.5581, lng: 32.0567, blurb: "One of the store cities the Israelites were forced to build for Pharaoh." },
  { id: "red_sea", name: "Red Sea", aliases: [], lat: 27.9, lng: 34.0, blurb: "The sea God parted so Israel could escape Pharaoh's army; the exact crossing point is debated." },
  { id: "mount_sinai", name: "Mount Sinai", aliases: ["Mount Horeb"], lat: 28.5392, lng: 33.9734, blurb: "Where Moses received the Ten Commandments; the traditional site is in Egypt's southern Sinai Peninsula." },
  { id: "kadesh_barnea", name: "Kadesh Barnea", aliases: [], lat: 30.6875, lng: 34.4864, blurb: "Israel's base camp for much of the wilderness wandering, and where the twelve spies were sent from." },
  { id: "mount_hor", name: "Mount Hor", aliases: [], lat: 30.3225, lng: 35.3997, blurb: "Where the priest Aaron died and was buried, near the border of Edom." },
  { id: "edom", name: "Edom", aliases: [], lat: 30.5, lng: 35.5, blurb: "The mountainous region south of the Dead Sea settled by Esau's descendants." },
  { id: "moab", name: "Moab", aliases: [], lat: 31.15, lng: 35.75, blurb: "The kingdom east of the Dead Sea where Ruth was born and Israel camped before entering Canaan." },
  { id: "mount_nebo", name: "Mount Nebo", aliases: [], lat: 31.7686, lng: 35.7256, blurb: "Where Moses viewed the Promised Land before his death, across the Jordan from Jericho." },

  // Conquest / Judges
  { id: "jericho", name: "Jericho", aliases: [], lat: 31.8667, lng: 35.4500, blurb: "The fortified city whose walls fell after Israel marched around it, the first conquest in Canaan." },
  { id: "ai", name: "Ai", aliases: [], lat: 31.9256, lng: 35.2664, blurb: "A Canaanite city Israel initially failed to conquer because of Achan's sin, then destroyed." },
  { id: "gilgal", name: "Gilgal", aliases: [], lat: 31.8797, lng: 35.4664, blurb: "Israel's first camp after crossing the Jordan, where the men were circumcised and Passover kept." },
  { id: "shiloh", name: "Shiloh", aliases: [], lat: 32.0558, lng: 35.2897, blurb: "Home of the tabernacle and the Ark of the Covenant for much of the period of the Judges." },
  { id: "gibeon", name: "Gibeon", aliases: [], lat: 31.8467, lng: 35.1806, blurb: "The city whose inhabitants tricked Joshua into a treaty, later the site of a famous battle." },
  { id: "mizpah", name: "Mizpah", aliases: [], lat: 31.9083, lng: 35.2181, blurb: "A gathering place for Israel's tribes, associated with Samuel's leadership and judgment." },
  { id: "mount_gerizim", name: "Mount Gerizim", aliases: [], lat: 32.1989, lng: 35.2728, blurb: "The mountain of blessing where half the tribes stood as the Law was read after entering Canaan." },
  { id: "mount_ebal", name: "Mount Ebal", aliases: [], lat: 32.2264, lng: 35.2814, blurb: "The mountain of cursing paired with Mount Gerizim in the covenant renewal ceremony." },
  { id: "ramah", name: "Ramah", aliases: [], lat: 31.8628, lng: 35.2358, blurb: "The prophet Samuel's hometown and burial place." },
  { id: "timnah", name: "Timnah", aliases: [], lat: 31.7669, lng: 34.9614, blurb: "A Philistine town connected to Samson's marriage and early exploits." },
  { id: "gath", name: "Gath", aliases: [], lat: 31.7006, lng: 34.8478, blurb: "One of the five Philistine city-states, home of the giant Goliath." },
  { id: "ashkelon", name: "Ashkelon", aliases: [], lat: 31.6688, lng: 34.5742, blurb: "A major Philistine coastal city, one of the Philistine pentapolis." },
  { id: "ashdod", name: "Ashdod", aliases: [], lat: 31.8044, lng: 34.6553, blurb: "A Philistine city where the captured Ark of the Covenant was placed in the temple of Dagon." },
  { id: "gaza", name: "Gaza", aliases: [], lat: 31.5017, lng: 34.4668, blurb: "A Philistine stronghold where Samson was imprisoned and pulled down the temple pillars." },
  { id: "ekron", name: "Ekron", aliases: [], lat: 31.7717, lng: 34.8508, blurb: "The northernmost of the five Philistine cities." },
  { id: "dan_city", name: "Dan", aliases: [], lat: 33.2489, lng: 35.6522, blurb: "The northernmost city of Israel, marking the far end of the phrase \"from Dan to Beersheba.\"" },
  { id: "kiriath_jearim", name: "Kiriath-jearim", aliases: [], lat: 31.8022, lng: 35.1097, blurb: "Where the Ark of the Covenant rested for twenty years before David brought it to Jerusalem." },

  // United & Divided Kingdom
  { id: "jerusalem", name: "Jerusalem", aliases: ["Zion", "City of David", "Salem"], lat: 31.7683, lng: 35.2137, blurb: "David's capital and the site of Solomon's Temple; the central city of Israel's history and worship." },
  { id: "gibeah", name: "Gibeah", aliases: [], lat: 31.8339, lng: 35.2306, blurb: "King Saul's hometown and capital." },
  { id: "ziklag", name: "Ziklag", aliases: [], lat: 31.4, lng: 34.65, blurb: "A town given to David by the Philistine king Achish during his years fleeing Saul." },
  { id: "endor", name: "Endor", aliases: [], lat: 32.6108, lng: 35.3839, blurb: "Where Saul, in desperation, consulted a medium the night before his final battle." },
  { id: "jezreel", name: "Jezreel", aliases: [], lat: 32.5581, lng: 35.3253, blurb: "A royal city in the fertile valley of the same name, site of Naboth's vineyard and Jehu's purge." },
  { id: "mount_gilboa", name: "Mount Gilboa", aliases: [], lat: 32.5167, lng: 35.4167, blurb: "Where King Saul and his sons died in battle against the Philistines." },
  { id: "mount_carmel", name: "Mount Carmel", aliases: [], lat: 32.7304, lng: 35.0413, blurb: "Where Elijah confronted the prophets of Baal and called down fire from heaven." },
  { id: "shunem", name: "Shunem", aliases: [], lat: 32.5775, lng: 35.3436, blurb: "Home of the woman whose son Elisha raised from death." },
  { id: "megiddo", name: "Megiddo", aliases: [], lat: 32.5850, lng: 35.1836, blurb: "A strategic fortress city overlooking the Jezreel Valley, site of many biblical battles." },
  { id: "tyre", name: "Tyre", aliases: [], lat: 33.2704, lng: 35.2038, blurb: "A wealthy Phoenician port city that supplied cedar and craftsmen for Solomon's Temple." },
  { id: "sidon", name: "Sidon", aliases: [], lat: 33.5571, lng: 35.3729, blurb: "Tyre's sister Phoenician port city, mentioned throughout the Old and New Testaments." },
  { id: "ophir", name: "Ophir", aliases: [], lat: 15.0, lng: 45.0, blurb: "A gold-rich land Solomon's ships traded with; its exact location (possibly Arabia or East Africa) is disputed." },
  { id: "samaria", name: "Samaria", aliases: [], lat: 32.2775, lng: 35.1900, blurb: "Capital of the northern kingdom of Israel, built by King Omri." },
  { id: "damascus", name: "Damascus", aliases: [], lat: 33.5138, lng: 36.2765, blurb: "Capital of Aram, a frequent adversary of Israel, and later where Paul was converted." },
  { id: "nineveh", name: "Nineveh", aliases: [], lat: 36.3600, lng: 43.1500, blurb: "Capital of the Assyrian Empire, the city Jonah was sent to warn of judgment." },
  { id: "lachish", name: "Lachish", aliases: [], lat: 31.5644, lng: 34.8494, blurb: "A fortified city of Judah famously besieged by the Assyrians under Sennacherib." },

  // Exile & Persian Period
  { id: "susa", name: "Susa", aliases: ["Shushan"], lat: 32.1875, lng: 48.2531, blurb: "The Persian royal capital where the events of the book of Esther take place." },
  { id: "ecbatana", name: "Ecbatana", aliases: [], lat: 34.0954, lng: 49.7013, blurb: "A summer capital of the Persian kings, mentioned in the book of Ezra." },
  { id: "persepolis", name: "Persepolis", aliases: [], lat: 29.9354, lng: 52.8916, blurb: "A ceremonial capital of the Persian Empire during the period of Israel's exile and return." },

  // Gospels
  { id: "nazareth", name: "Nazareth", aliases: [], lat: 32.6996, lng: 35.3035, blurb: "The town in Galilee where Jesus grew up." },
  { id: "capernaum", name: "Capernaum", aliases: [], lat: 32.8806, lng: 35.5750, blurb: "A fishing town on the Sea of Galilee that became the base of Jesus's ministry." },
  { id: "cana", name: "Cana", aliases: [], lat: 32.7469, lng: 35.3389, blurb: "Where Jesus turned water into wine at a wedding, his first recorded miracle." },
  { id: "bethsaida", name: "Bethsaida", aliases: [], lat: 32.9083, lng: 35.6289, blurb: "Hometown of the apostles Peter, Andrew, and Philip, on the Sea of Galilee's northern shore." },
  { id: "chorazin", name: "Chorazin", aliases: [], lat: 32.9106, lng: 35.5586, blurb: "One of the towns Jesus rebuked for not repenting despite witnessing his miracles." },
  { id: "magdala", name: "Magdala", aliases: [], lat: 32.8214, lng: 35.5136, blurb: "Home town of Mary Magdalene, on the western shore of the Sea of Galilee." },
  { id: "tiberias", name: "Tiberias", aliases: [], lat: 32.7922, lng: 35.5312, blurb: "A city on the Sea of Galilee built by Herod Antipas, which lent the sea its alternate name." },
  { id: "sea_of_galilee", name: "Sea of Galilee", aliases: ["Lake Gennesaret", "Sea of Tiberias"], lat: 32.8331, lng: 35.5844, blurb: "The freshwater lake at the center of Jesus's Galilean ministry, where he calmed the storm and called fishermen." },
  { id: "jordan_river", name: "Jordan River", aliases: [], lat: 31.8393, lng: 35.5439, blurb: "The river where John baptized Jesus, and Israel's eastern boundary throughout the Old Testament." },
  { id: "bethany", name: "Bethany", aliases: [], lat: 31.7717, lng: 35.2603, blurb: "Home of Mary, Martha, and Lazarus, near Jerusalem on the Mount of Olives." },
  { id: "bethphage", name: "Bethphage", aliases: [], lat: 31.7783, lng: 35.2578, blurb: "Where Jesus mounted the donkey for his triumphal entry into Jerusalem." },
  { id: "mount_of_olives", name: "Mount of Olives", aliases: [], lat: 31.7789, lng: 35.2436, blurb: "Overlooking Jerusalem, the site of Jesus's ascension and much of his teaching in his final week." },
  { id: "golgotha", name: "Golgotha", aliases: ["Calvary", "Place of the Skull"], lat: 31.7784, lng: 35.2298, blurb: "The site just outside Jerusalem's walls where Jesus was crucified." },
  { id: "gethsemane", name: "Gethsemane", aliases: [], lat: 31.7793, lng: 35.2400, blurb: "The garden at the foot of the Mount of Olives where Jesus prayed before his arrest." },
  { id: "sychar", name: "Sychar", aliases: ["Jacob's Well"], lat: 32.2136, lng: 35.2803, blurb: "The Samaritan town where Jesus spoke with the woman at the well." },
  { id: "caesarea_philippi", name: "Caesarea Philippi", aliases: [], lat: 33.2489, lng: 35.6928, blurb: "Where Peter declared Jesus to be the Christ, near the source of the Jordan River." },
  { id: "mount_tabor", name: "Mount Tabor", aliases: [], lat: 32.6864, lng: 35.3911, blurb: "A traditional site of the Transfiguration, rising above the Jezreel Valley." },
  { id: "nain", name: "Nain", aliases: [], lat: 32.6017, lng: 35.3861, blurb: "Where Jesus raised a widow's only son as his funeral procession left the town." },
  { id: "emmaus", name: "Emmaus", aliases: [], lat: 31.8386, lng: 34.9878, blurb: "Where the risen Jesus walked with two disciples who didn't recognize him; several candidate sites exist." },
  { id: "decapolis", name: "Decapolis", aliases: [], lat: 32.7, lng: 35.9, blurb: "A league of ten Greek cities east of the Jordan where Jesus ministered and healed." },
  { id: "arimathea", name: "Arimathea", aliases: [], lat: 31.9856, lng: 34.9339, blurb: "Hometown of Joseph, the disciple who donated his tomb for Jesus's burial; the exact site is uncertain." },

  // Acts, Epistles & Revelation
  { id: "antioch_syria", name: "Antioch (Syria)", aliases: ["Antioch"], lat: 36.2, lng: 36.15, blurb: "Hub of the early Gentile church and Paul's missionary base, where believers were first called Christians." },
  { id: "antioch_pisidia", name: "Antioch in Pisidia", aliases: [], lat: 38.3, lng: 31.2, blurb: "A stop on Paul's first missionary journey in central Asia Minor." },
  { id: "joppa", name: "Joppa", aliases: ["Jaffa"], lat: 32.0522, lng: 34.7500, blurb: "The port where Jonah fled by ship, and where Peter received his vision to preach to the Gentiles." },
  { id: "caesarea_maritima", name: "Caesarea Maritima", aliases: ["Caesarea"], lat: 32.5000, lng: 34.8918, blurb: "A Roman port city and administrative capital where Paul was imprisoned before his voyage to Rome." },
  { id: "cyprus_salamis", name: "Salamis (Cyprus)", aliases: [], lat: 35.1856, lng: 33.9036, blurb: "The first stop of Paul and Barnabas's first missionary journey." },
  { id: "paphos", name: "Paphos", aliases: [], lat: 34.7571, lng: 32.4066, blurb: "Where Paul confronted the sorcerer Elymas on Cyprus." },
  { id: "perga", name: "Perga", aliases: [], lat: 36.9614, lng: 30.8483, blurb: "A city in Pamphylia visited on Paul's missionary journeys." },
  { id: "attalia", name: "Attalia", aliases: [], lat: 36.8969, lng: 30.7133, blurb: "A port city Paul and Barnabas sailed from at the end of their first missionary journey." },
  { id: "iconium", name: "Iconium", aliases: [], lat: 37.8667, lng: 32.4833, blurb: "A city in central Asia Minor where Paul preached and faced opposition." },
  { id: "lystra", name: "Lystra", aliases: [], lat: 37.5806, lng: 32.4514, blurb: "Where Paul was stoned and left for dead, and later Timothy's hometown." },
  { id: "derbe", name: "Derbe", aliases: [], lat: 37.3489, lng: 33.2564, blurb: "A city Paul visited on his first and second missionary journeys." },
  { id: "troas", name: "Troas", aliases: [], lat: 39.7556, lng: 26.1608, blurb: "Where Paul received the vision of a man from Macedonia calling him to Europe." },
  { id: "philippi", name: "Philippi", aliases: [], lat: 41.0139, lng: 24.2874, blurb: "The first city in Europe Paul preached in, where he and Silas were imprisoned and released by an earthquake." },
  { id: "thessalonica", name: "Thessalonica", aliases: [], lat: 40.6401, lng: 22.9444, blurb: "A major Macedonian city Paul planted a church in, later addressed in his letters." },
  { id: "berea", name: "Berea", aliases: [], lat: 40.5236, lng: 22.2039, blurb: "Home of Jews described as more noble because they examined the scriptures daily." },
  { id: "athens", name: "Athens", aliases: [], lat: 37.9838, lng: 23.7275, blurb: "Where Paul addressed the philosophers at the Areopagus about the \"unknown god.\"" },
  { id: "corinth", name: "Corinth", aliases: [], lat: 37.9061, lng: 22.8792, blurb: "A major commercial city where Paul spent a year and a half planting a church, later addressed in his letters." },
  { id: "ephesus", name: "Ephesus", aliases: [], lat: 37.9495, lng: 27.3639, blurb: "A major center of Paul's ministry in Asia Minor, and one of the seven churches of Revelation." },
  { id: "miletus", name: "Miletus", aliases: [], lat: 37.5292, lng: 27.2775, blurb: "Where Paul gave his farewell address to the Ephesian elders." },
  { id: "rhodes", name: "Rhodes", aliases: [], lat: 36.4341, lng: 28.2176, blurb: "An island Paul's ship stopped at on the return from his third missionary journey." },
  { id: "patara", name: "Patara", aliases: [], lat: 36.2664, lng: 29.3161, blurb: "A port where Paul changed ships on his way to Jerusalem." },
  { id: "ptolemais", name: "Ptolemais", aliases: ["Acco", "Akko"], lat: 32.9281, lng: 35.0819, blurb: "A coastal city Paul visited briefly on his final journey to Jerusalem." },
  { id: "malta", name: "Malta", aliases: [], lat: 35.9375, lng: 14.3754, blurb: "The island where Paul was shipwrecked and survived a snakebite on his way to Rome." },
  { id: "puteoli", name: "Puteoli", aliases: [], lat: 40.8236, lng: 14.1219, blurb: "The Italian port where Paul landed on his way to Rome." },
  { id: "rome", name: "Rome", aliases: [], lat: 41.9028, lng: 12.4964, blurb: "The imperial capital where Paul was imprisoned and, by tradition, martyred." },
  { id: "colossae", name: "Colossae", aliases: [], lat: 37.7833, lng: 29.3667, blurb: "A city in the Lycus Valley whose church received Paul's letter to the Colossians." },
  { id: "laodicea", name: "Laodicea", aliases: [], lat: 37.8367, lng: 29.1075, blurb: "A wealthy city rebuked in Revelation for being \"lukewarm\" in faith." },
  { id: "hierapolis", name: "Hierapolis", aliases: [], lat: 37.9257, lng: 29.1256, blurb: "A city near Colossae and Laodicea mentioned in Paul's letter to the Colossians." },
  { id: "smyrna", name: "Smyrna", aliases: [], lat: 38.4237, lng: 27.1428, blurb: "One of the seven churches of Revelation, praised despite suffering persecution." },
  { id: "pergamum", name: "Pergamum", aliases: ["Pergamos"], lat: 39.1213, lng: 27.1804, blurb: "One of the seven churches of Revelation, described as the place \"where Satan's throne is.\"" },
  { id: "sardis", name: "Sardis", aliases: [], lat: 38.4889, lng: 28.0406, blurb: "One of the seven churches of Revelation, warned for having a reputation for life while being spiritually dead." },
  { id: "philadelphia_asia", name: "Philadelphia (Asia Minor)", aliases: [], lat: 38.3492, lng: 28.5175, blurb: "One of the seven churches of Revelation, commended for keeping the word patiently." },
  { id: "patmos", name: "Patmos", aliases: [], lat: 37.3086, lng: 26.5453, blurb: "The island where John received the visions recorded in the book of Revelation." },
  { id: "crete", name: "Crete", aliases: [], lat: 35.2401, lng: 24.8093, blurb: "An island Paul's ship passed on the way to Rome, and where Titus was left to appoint elders." },

  // Additional Old Testament sites
  { id: "valley_of_elah", name: "Valley of Elah", aliases: [], lat: 31.6997, lng: 34.9578, blurb: "Where the young David killed the giant Goliath." },
  { id: "adullam", name: "Cave of Adullam", aliases: [], lat: 31.6083, lng: 34.9994, blurb: "Where David hid from Saul and gathered a band of followers who became his mighty men." },
  { id: "en_gedi", name: "En Gedi", aliases: [], lat: 31.4614, lng: 35.3897, blurb: "An oasis by the Dead Sea where David hid from Saul and once spared his life in a cave." },
  { id: "ziph", name: "Ziph", aliases: [], lat: 31.4386, lng: 35.1211, blurb: "A wilderness area where David hid from Saul and was twice betrayed by local informants." },
  { id: "nob", name: "Nob", aliases: [], lat: 31.7856, lng: 35.2381, blurb: "A city of priests where David received bread and Goliath's sword while fleeing Saul." },
  { id: "dothan", name: "Dothan", aliases: [], lat: 32.4239, lng: 35.2694, blurb: "Where Joseph's brothers sold him into slavery, and later where Elisha saw an army of fire." },
  { id: "mahanaim", name: "Mahanaim", aliases: [], lat: 32.35, lng: 35.65, blurb: "Where Jacob was met by angels, and later a refuge for David during Absalom's rebellion." },
  { id: "ramoth_gilead", name: "Ramoth Gilead", aliases: [], lat: 32.6167, lng: 35.75, blurb: "A contested border city, site of the battle where King Ahab was killed." },
  { id: "jabesh_gilead", name: "Jabesh Gilead", aliases: [], lat: 32.35, lng: 35.6, blurb: "A city Saul rescued early in his reign, and whose people later retrieved his body for burial." },
]

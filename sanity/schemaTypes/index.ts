import { advancedRules } from "./advancedRules";
import { article } from "./article";
import { club } from "./club";
import { clubPage } from "./clubPage";
import { event } from "./event";
import { game } from "./game";
import { joiningPositions } from "./joiningPositions";
import { player } from "./player";
import { sportNotions } from "./sportNotions";

export const schemaTypes = [
	player,
	club,
	clubPage,
	joiningPositions,
	sportNotions,
	advancedRules,
	game,
	event,
	article,
];

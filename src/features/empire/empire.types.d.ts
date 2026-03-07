import {
	PLAN_COGCPROGRAM_TYPE,
	PLAN_FACTION,
} from "@/stores/planningStore.types";
import { IMaterialIO } from "@/features/planning/usePlanCalculation.types";

interface IEmpirePlanListData {
	uuid: string;
	name: string | undefined;
	planet: string;
	permits: number;
	cogc: PLAN_COGCPROGRAM_TYPE;
	profit: number;
}

interface IEmpireMaterialIOPlanet {
	planetId: string;
	planUuid: string;
	planName: string;
	delta: number;
	input: number;
	output: number;
	price: number;
}

interface IEmpireMaterialIO {
	ticker: string;
	input: number;
	output: number;
	delta: number;
	deltaPrice: number;
	inputPlanets: IEmpireMaterialIOPlanet[];
	outputPlanets: IEmpireMaterialIOPlanet[];
}

interface IEmpirePlanMaterialIO {
	planetId: string;
	planUuid: string;
	planName: string;
	materialIO: IMaterialIO[];
}

interface IEmpirePatchPayload {
	empire_faction: PLAN_FACTION;
	empire_permits_used: number;
	empire_permits_total: number;
	empire_name: string;
}

type IEmpireCreatePayload = IEmpirePatchPayload;

interface IEmpireCostOverview {
	totalProfit: number;
	totalRevenue: number;
	totalCost: number;
	totalAreaUsed: number;
}

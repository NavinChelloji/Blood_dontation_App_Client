import { HeroCard } from "../../app/layoutes/HeroCard"
import { BloodSearchCard } from "../../components/common/BloodSearchCard/BloodSearchCard"
import { DonarTable } from "./DonarsTables"
import { NearBloodRequest } from "./NearBloodRequest"
import { StatsRow } from "./StatsRow"

export const Dashboard = ({ mob }) => {
    return (
        <>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 262px", gap: 16, marginBottom: 16 }}>
                <HeroCard mob={mob}>
                </HeroCard>
                <BloodSearchCard></BloodSearchCard>
            </div>
            <StatsRow mob={mob}></StatsRow>
            <NearBloodRequest mob={mob}></NearBloodRequest>
            <DonarTable></DonarTable>
        </>)
}
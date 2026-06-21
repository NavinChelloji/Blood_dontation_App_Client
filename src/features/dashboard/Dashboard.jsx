import { HeroCard } from "../../app/layoutes/HeroCard"
import { BloodSearchCard } from "../../components/common/BloodSearchCard/BloodSearchCard"
import { DonarTable } from "./DonarsTables"
import { NearBloodRequest } from "./NearBloodRequest"
import { StatsRow } from "./StatsRow"
import { useEffect , useState} from "react";
import useAbortController from "../../hooks/useAbortController";
import { getDonors } from "../../services/donor.service";

export const Dashboard = ({ mob }) => {
    const { getSignal } = useAbortController();
    const [donors, setDonors] = useState([]);
    useEffect(() => {
        getDonors(getSignal())
            .then((data) => {
                console.log('Donors:', data);
                setDonors(data);
            })
            .catch((err) => {
                setDonors([]);
                console.error('Failed to fetch donors:', err);
            });
    }, []);
    return (
        <>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 262px", gap: 16, marginBottom: 16 }}>
                <HeroCard mob={mob}>
                </HeroCard>
                <BloodSearchCard></BloodSearchCard>
            </div>
            <StatsRow mob={mob}></StatsRow>
            <NearBloodRequest mob={mob}></NearBloodRequest>
            <DonarTable data={donors} />
        </>)
}
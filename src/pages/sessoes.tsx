import { CampaignPageShell } from "@/components/CampaignPageShell";
import { SessionBook } from "@/components/SessionBook";
import { sessions } from "@/data/sessions";

export default function SessoesPage() {
  return (
    <CampaignPageShell title="Sessões">
      <SessionBook sessions={sessions} />
    </CampaignPageShell>
  );
}

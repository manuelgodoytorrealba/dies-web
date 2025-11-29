import type { Actions, PageServerLoad } from './$types';
import { getLeads, updateLeadStatus } from '$lib/server/db-repo';

export const load: PageServerLoad = async () => {
  const leads = await getLeads(200);
  return { leads };
};

export const actions: Actions = {
  updateStatus: async ({ request }) => {
    const formData = await request.formData();
    const leadId = String(formData.get('lead_id') ?? '');
    const status = String(formData.get('status') ?? '');

    if (!leadId || !status) {
      return { ok: false };
    }

    await updateLeadStatus(leadId, status);
    return { ok: true };
  }
};
import { redirect } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params: { story } }) => {
    redirect(308, `/story/${story}`);
};

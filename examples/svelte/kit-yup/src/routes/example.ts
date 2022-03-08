
import type { RequestHandler } from '@sveltejs/kit';


export const post: RequestHandler = async ({ request }) => {

    //console.log(request.body)
    const d = await request.json()

    return {
        body: {
            ok: d
        }
    }
}
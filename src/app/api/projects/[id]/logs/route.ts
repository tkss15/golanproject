import { getProjectLogs } from "@/lib/queries/logs/getProjectLogs";

export async function GET(request: Request, {params}: {params: {id: number}}) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const offset = parseInt(searchParams.get('offset') || '0');
    const logs = await getProjectLogs(id, limit, offset);
    return new Response(JSON.stringify(logs), { status: 200 });
}

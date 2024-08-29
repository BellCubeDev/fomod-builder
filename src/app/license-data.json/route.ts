import { NextResponse } from "next/server";
import { generateLicenseData } from "./generateLicenseData";

export const dynamic = "force-static"

export async function GET() {
    return NextResponse.json(await generateLicenseData());
}

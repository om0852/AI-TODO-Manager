import { db } from "@/lib/db";
import { workspaces } from "@/lib/schema";
import { getCurrentUser } from "@/lib/user";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const data = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.userId, currentUser.userId));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    const { userId } = await getCurrentUser();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized user" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const createWorkspace = await db
      .insert(workspaces)
      .values({ name, userId })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Workspace Created Successfully",
      data: createWorkspace[0],
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { name, id } = await request.json();
    const { userId } = await getCurrentUser();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized user" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "Workspace Id is required" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const updateData = await db
      .update(workspaces)
      .set({ name })
      .where(eq(workspaces.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Updated Successfully",
      data: updateData[0],
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const { userId } = await getCurrentUser();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized user" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "Workspace Id is required" }, { status: 400 });
    }

    await db.delete(workspaces).where(eq(workspaces.id, id));

    return NextResponse.json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

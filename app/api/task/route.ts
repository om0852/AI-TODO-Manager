import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { getCurrentUser } from "@/lib/user";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextResponse) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorize User" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: "workspaceId is required" },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.workspaceId, Number(workspaceId)));
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      title,
      description,
      workspaceId,
      dueDate,
      priority,
      status,
      progress,
    } = await request.json();

    if (!title || !workspaceId) {
      return NextResponse.json(
        { success: false, error: "Title and workspaceId are required" },
        { status: 400 }
      );
    }

    const newTask = await db
      .insert(tasks)
      .values({
        title,
        description,
        workspaceId,
        dueDate,
        priority,
        status,
        progress,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Task Created Successfully",
      data: newTask[0],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, title, description, dueDate, priority, status, progress } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Task id is required" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(tasks)
      .set({ title, description, dueDate, priority, status, progress })
      .where(eq(tasks.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Task Updated",
      data: updated[0],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Delete task
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Task id is required" },
        { status: 400 }
      );
    }

    await db.delete(tasks).where(eq(tasks.id, id));
    return NextResponse.json({
      success: true,
      message: "Task Deleted Successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

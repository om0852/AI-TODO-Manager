import { db } from "@/lib/db";
import { subtasks } from "@/lib/schema";
import { getCurrentUser } from "@/lib/user";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.userId)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: "Missing taskId" },
        { status: 400 }
      );
    }

    const data = await db
      .select()
      .from(subtasks)
      .where(
        and(
          eq(subtasks.taskId, Number(taskId)),
          eq(subtasks.userId, user.userId)
        )
      );

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.userId)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

    const { title, taskId } = await req.json();

    if (!title || !taskId) {
      return NextResponse.json(
        { success: false, error: "title and taskId are required" },
        { status: 400 }
      );
    }

    const created = await db
      .insert(subtasks)
      .values({
        title,
        taskId,
        userId: user.userId,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Subtask created",
      data: created[0],
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.userId)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

    const { id, title, isCompleted } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Subtask ID is required" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(subtasks)
      .set({ title, isCompleted })
      .where(eq(subtasks.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Subtask updated",
      data: updated[0],
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.userId)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Subtask ID is required" },
        { status: 400 }
      );
    }

    await db.delete(subtasks).where(eq(subtasks.id, id));

    return NextResponse.json({ success: true, message: "Subtask deleted" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

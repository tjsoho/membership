import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { stripe } from "@/lib/stripe";

export default async function SuccessPage({
  searchParams,
  params,
}: {
  searchParams: { payment_intent: string };
  params: { courseId: string };
}) {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );

  if (paymentIntent.status === "succeeded") {
    await prisma.purchase.create({
      data: {
        userId: session.user.id,
        courseId: params.courseId,
        paymentIntentId: paymentIntent.id,
      },
    });

    redirect(`/courses/${params.courseId}`);
  }

  redirect("/courses");
}

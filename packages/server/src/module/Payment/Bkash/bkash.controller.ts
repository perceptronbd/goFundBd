import { TRPCError } from "@trpc/server";
import { errorResponse, successResponse } from "../../../utils/httpResponse";
import {
  createBkashPaymentService,
  executeBkashPaymentService,
} from "./bkash.service";
import { Response } from "express";

export const createBkashPaymentController = async (
  amount: string,
  bkashToken: string,
  donation_id: string
) => {
  try {
    const paymentBkash = await createBkashPaymentService(
      amount,
      bkashToken,
      donation_id
    );
    return successResponse(paymentBkash, 201);
  } catch (error) {
    console.log(error);
    const trpcError = new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred, please try again later.",
    });
    return errorResponse(error, trpcError);
  }
};

export const callbackBkashPaymentController = async (
  paymentId: string,
  status: string,
  res: Response,
  bkashToken: string
) => {
  if (status === "cancel" || status === "failure") {
    return res.redirect(`${process.env.FRONTEND_URL}/error?message=${status}`);
  }
  if (status === "success") {
    try {
      await executeBkashPaymentService(paymentId, bkashToken);
    } catch (error) {
      console.log(error);
      const trpcError = new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred, please try again later.",
      });
      return errorResponse(error, trpcError);
    }
  }
};

const bkashPaymentController = {
  createBkashPaymentController,
  callbackBkashPaymentController,
};

export default bkashPaymentController;

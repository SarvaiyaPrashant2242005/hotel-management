import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Hotel } from "lucide-react";

type PaymentOption = "pay-now" | "pay-at-hotel";

interface PaymentOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomDetails: {
    roomNumber: string;
    type: string;
    pricePerNight: number;
    nights: number;
    totalPrice: number;
  };
  onConfirm: (paymentOption: PaymentOption) => void;
  isProcessing?: boolean;
}

const PaymentOptionsDialog = ({
  open,
  onOpenChange,
  roomDetails,
  onConfirm,
  isProcessing = false,
}: PaymentOptionsDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<PaymentOption>("pay-now");

  const advancePayment = Math.round(roomDetails.totalPrice * 0.1);
  const remainingPayment = roomDetails.totalPrice - advancePayment;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose Payment Option</DialogTitle>
          <DialogDescription>
            Select how you'd like to pay for your booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Booking Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm">Booking Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room:</span>
                <span className="font-medium">{roomDetails.type} (#{roomDetails.roomNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price per night:</span>
                <span>₹{roomDetails.pricePerNight.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Number of nights:</span>
                <span>{roomDetails.nights}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold text-lg">₹{roomDetails.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <RadioGroup value={selectedOption} onValueChange={(val) => setSelectedOption(val as PaymentOption)}>
            <div className="space-y-3">
              {/* Pay Now Option */}
              <div
                className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedOption === "pay-now" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedOption("pay-now")}
              >
                <RadioGroupItem value="pay-now" id="pay-now" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="pay-now" className="cursor-pointer flex items-center gap-2 font-semibold">
                    <CreditCard className="w-4 h-4" />
                    Pay Now (Full Payment)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pay the full amount of ₹{roomDetails.totalPrice.toLocaleString()} now using Razorpay
                  </p>
                  <div className="mt-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-1 rounded inline-block">
                    Instant confirmation
                  </div>
                </div>
              </div>

              {/* Pay at Hotel Option */}
              <div
                className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedOption === "pay-at-hotel" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedOption("pay-at-hotel")}
              >
                <RadioGroupItem value="pay-at-hotel" id="pay-at-hotel" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="pay-at-hotel" className="cursor-pointer flex items-center gap-2 font-semibold">
                    <Hotel className="w-4 h-4" />
                    Pay at Hotel
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pay 10% now to confirm your booking, remaining at check-in
                  </p>
                  
                  {/* Payment Breakdown */}
                  <div className="mt-3 space-y-1.5 text-sm bg-background rounded-md p-3 border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Advance payment (10%):</span>
                      <span className="font-semibold text-primary">₹{advancePayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pay at hotel (90%):</span>
                      <span className="font-medium">₹{remainingPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t text-xs">
                      <span>Total:</span>
                      <span>₹{roomDetails.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => onConfirm(selectedOption)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentOptionsDialog;

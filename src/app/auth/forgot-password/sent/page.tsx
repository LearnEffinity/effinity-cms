import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordSentPage() {
  return (
    <div className="container mx-auto max-w-md pt-16">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-semibold">Request Sent!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            An email has been sent to you with a reset link.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PassCardDisplayProps {
  passCard: any
  visitor?: any
}

export function PassCardDisplay({ passCard, visitor }: PassCardDisplayProps) {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="text-primary">Pass Card</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-2 border-primary">
          <div className="space-y-3">
            <div className="bg-primary h-16 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">S</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">VISITOR NAME</p>
              <p className="font-bold text-foreground">
                {visitor?.first_name} {visitor?.last_name}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">PASS NUMBER</p>
              <p className="font-mono font-bold text-primary text-lg">{passCard.card_number}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">LEVEL</p>
                <p className="font-semibold">{passCard.access_level}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">STATUS</p>
                <Badge
                  className={passCard.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {passCard.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">VALID UNTIL</p>
              <p className="font-medium">{new Date(passCard.expires_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

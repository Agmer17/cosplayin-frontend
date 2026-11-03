"use client"

import { useIsMobile } from "@/lib/responsive_util"
import { GeolocateControl, GeolocateErrorEvent, NavigationControl } from "@vis.gl/react-maplibre"
import { toast } from "sonner"

export default function MapNavigation() {

    const isMobile = useIsMobile()

    const onGpsTrackError = (e: GeolocateErrorEvent) => {
        console.log("kepnggil mas errornya!")
        if (e.code == 1) {
            toast.warning("tolong izinkan akses lokasi jika ingin menggunakan fitur ini", {
                position: isMobile ? "bottom-right" : "top-right",
                duration: 1500
            })
        } else if (e.code == 2) {
            toast.warning("tolong izinkan akses lokasi jika ingin menggunakan fitur ini", {
                position: isMobile ? "bottom-right" : "top-right",
                duration: 1500,
            })
        } else {

        }
    }

    return (
        <div>
            {!isMobile && (
                <NavigationControl
                    position="bottom-right"
                    showCompass={false}
                    showZoom={true}
                    style={{
                        marginRight: 12,
                        marginBottom: 24,
                    }}
                />
            )}
            <GeolocateControl
                position={isMobile ? "top-right" : "bottom-right"}
                onError={onGpsTrackError}
                trackUserLocation={true}
                showAccuracyCircle={true}
                showUserLocation={true}
            />
        </div>
    )

}
import { Avatar, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";

export default function AuthUserAvatar() {


    const cosplayImage = ["pp_1.webp", "pp_2.webp", "pp_3.webp", "pp_4.webp", "pp_5.jpg"];

    return (
        <AvatarGroup className="flex w-full justify-center">
            {cosplayImage.map((item, idx) => {
                return (
                    <Avatar key={idx}>
                        <AvatarImage src={`/assets/image/${item}`}>
                        </AvatarImage>
                    </Avatar>
                )
            })}

            <AvatarGroupCount>+20</AvatarGroupCount>
        </AvatarGroup>
    )
}
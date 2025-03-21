import PostProp from "./PostProp";
import UserProp from "./UserProp";

class Mock {
    static mockPosts: PostProp[] = [
        new PostProp(
            'id1',
            'gymrat123',
            'Leg Day Gains',
            'https://i.redd.it/lqv4e92wzpbd1.jpeg',
            'Crushed it with squats today!',
            new Date('2025-03-21T10:00:00Z').getTime(),
            15,
            3
        ),
        new PostProp(
            'id2',
            'fitfam',
            'Protein Shake Recipe',
            'https://www.spongebobshop.com/cdn/shop/products/SB-WO-LARRYS-TEE_Viacom_SpongeBob_UnisexTshirt_1701_Banana_Image02_800x.jpg?v=1585771418',
            'Try this post-workout shake.',
            new Date('2025-03-17T10:00:00Z').getTime(),
            8,
            1
        ),
        new PostProp(
            'id3',
            'liraz581',
            'This is my post!',
            'https://www.spongebobshop.com/cdn/shop/products/SB-WO-LARRYS-TEE_Viacom_SpongeBob_UnisexTshirt_1701_Banana_Image02_800x.jpg?v=1585771418',
            'but only if it works',
            new Date('2025-03-19T10:00:00Z').getTime(),
            8,
            1
        )
    ];

    static mockUser: UserProp = new UserProp(
        "userA",
        "liraz",
        "example@gmail.com",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsJeP_sxmERoOejeq3vvMR1anQOxC3eBYMBsyPE_Bbb0WWMA8ky6bmUlOTboOPFFQxSQc&usqp=CAU"
    );
}

export default Mock
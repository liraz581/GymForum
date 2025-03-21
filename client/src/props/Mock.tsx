import PostProp from "./PostProp";

class Mock {
    static mockPosts: PostProp[] = [
        new PostProp(
            'gymrat123',
            'Leg Day Gains',
            'https://i.redd.it/lqv4e92wzpbd1.jpeg',
            'Crushed it with squats today!',
            '2025-03-19T10:00:00Z',
            15,
            3
        ),
        new PostProp(
            'fitfam',
            'Protein Shake Recipe',
            'https://www.spongebobshop.com/cdn/shop/products/SB-WO-LARRYS-TEE_Viacom_SpongeBob_UnisexTshirt_1701_Banana_Image02_800x.jpg?v=1585771418',
            'Try this post-workout shake.',
            '2025-03-18T14:30:00Z',
            8,
            1
        )
    ];
}

export default Mock
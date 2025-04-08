/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Operations related to posts
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Title and description are required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error creating post
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts with like info
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error fetching posts
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a specific post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: The post data
 *       404:
 *         description: Post not found
 *       500:
 *         description: Error fetching post
 */

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Title and description are required
 *       404:
 *         description: Post not found or unauthorized
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error updating post
 */

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found or unauthorized
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error deleting post
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the authenticated user's data
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Post comments operations
 */

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Create a comment for a specific post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The content of the comment
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Post ID and text are required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error adding comment
 */

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Get comments for a specific post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to fetch comments for
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   postId:
 *                     type: string
 *                   text:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Post ID is required
 *       500:
 *         description: Error fetching comments
 */

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Like/unlike posts
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Like a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the post to like
 *     responses:
 *       201:
 *         description: Post liked successfully
 *       400:
 *         description: Post ID is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error liking post
 */

/**
 * @swagger
 * /likes:
 *   delete:
 *     summary: Unlike a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the post to unlike
 *     responses:
 *       200:
 *         description: Like removed successfully
 *       400:
 *         description: Post ID is required
 *       404:
 *         description: Like not found or unauthorized
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error removing like
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Profile update operations
 */

/**
 * @swagger
 * /user/username:
 *   patch:
 *     summary: Update the user's username
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 description: New username
 *     responses:
 *       200:
 *         description: Username updated successfully
 *       400:
 *         description: Username is required
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error updating username
 */

/**
 * @swagger
 * /user/image:
 *   patch:
 *     summary: Update the user's profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New profile image
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *       400:
 *         description: Image is required
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error updating image
 */

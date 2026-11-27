/// <reference path="../../.pocketbase/pb_data/types.d.ts" />

/**
 * Initial schema: profiles on top of the built-in `users` auth collection,
 * plus posts, likes, comments and a read-only `post_stats` view.
 *
 * Access rules follow one principle: anyone can read, only the owner of a
 * record can write it, and ownership is always checked against
 * `@request.auth.id` so a client can never act on behalf of someone else.
 */
migrate(
  (app) => {
    // --- users: add a public username and a short bio ----------------------
    const users = app.findCollectionByNameOrId('users')

    users.fields.add(
      new TextField({
        name: 'username',
        required: true,
        min: 3,
        max: 30,
        pattern: '^[a-z0-9_]+$',
        presentable: true,
      }),
    )
    users.fields.add(new TextField({ name: 'bio', max: 160 }))
    users.addIndex('idx_users_username', true, 'username', '')

    // Profiles are public, but emails stay private (emailVisibility = false).
    users.listRule = ''
    users.viewRule = ''
    users.passwordAuth.identityFields = ['email', 'username']
    app.save(users)

    // --- posts ---------------------------------------------------------------
    const posts = new Collection({
      type: 'base',
      name: 'posts',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != '' && author = @request.auth.id",
      // The author can edit the caption but never hand the post to someone else.
      updateRule: 'author = @request.auth.id && @request.body.author:isset = false',
      deleteRule: 'author = @request.auth.id',
      fields: [
        {
          name: 'author',
          type: 'relation',
          required: true,
          collectionId: users.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'video',
          type: 'file',
          required: true,
          maxSelect: 1,
          maxSize: 50 * 1024 * 1024,
          mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
        },
        { name: 'caption', type: 'text', max: 280 },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_posts_created ON posts (created)',
        'CREATE INDEX idx_posts_author_created ON posts (author, created)',
      ],
    })
    app.save(posts)

    // --- likes ---------------------------------------------------------------
    const likes = new Collection({
      type: 'base',
      name: 'likes',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != '' && author = @request.auth.id",
      updateRule: null, // likes are immutable: create or delete only
      deleteRule: 'author = @request.auth.id',
      fields: [
        {
          name: 'post',
          type: 'relation',
          required: true,
          collectionId: posts.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'author',
          type: 'relation',
          required: true,
          collectionId: users.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'created', type: 'autodate', onCreate: true },
      ],
      // One like per user per post, enforced by the database.
      indexes: ['CREATE UNIQUE INDEX idx_likes_post_author ON likes (post, author)'],
    })
    app.save(likes)

    // --- comments ------------------------------------------------------------
    const comments = new Collection({
      type: 'base',
      name: 'comments',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != '' && author = @request.auth.id",
      updateRule: 'author = @request.auth.id && @request.body.author:isset = false',
      deleteRule: 'author = @request.auth.id',
      fields: [
        {
          name: 'post',
          type: 'relation',
          required: true,
          collectionId: posts.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'author',
          type: 'relation',
          required: true,
          collectionId: users.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'content', type: 'text', required: true, max: 500 },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_comments_post_created ON comments (post, created)'],
    })
    app.save(comments)

    // --- post_stats: like/comment counts computed in SQL, one row per post --
    const postStats = new Collection({
      type: 'view',
      name: 'post_stats',
      listRule: '',
      viewRule: '',
      viewQuery: `
        SELECT
          p.id,
          (SELECT COUNT(*) FROM likes l WHERE l.post = p.id) AS likes,
          (SELECT COUNT(*) FROM comments c WHERE c.post = p.id) AS comments
        FROM posts p
      `,
    })
    app.save(postStats)
  },
  (app) => {
    for (const name of ['post_stats', 'comments', 'likes', 'posts']) {
      app.delete(app.findCollectionByNameOrId(name))
    }

    const users = app.findCollectionByNameOrId('users')
    users.removeIndex('idx_users_username')
    users.fields.removeByName('username')
    users.fields.removeByName('bio')
    users.passwordAuth.identityFields = ['email']
    app.save(users)
  },
)

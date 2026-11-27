#!/usr/bin/env node
/**
 * Seeds a local PocketBase with demo users, reels, likes and comments.
 *
 *   npm run pb     # in one terminal
 *   npm run seed   # in another
 *
 * Demo videos are generated with ffmpeg (no binary assets in the repo).
 * Everything goes through the public API with normal user accounts, so the
 * seed also exercises the collection access rules.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import PocketBase from 'pocketbase'

const POCKETBASE_URL = process.env.POCKETBASE_URL ?? 'http://127.0.0.1:8090'
const PASSWORD = 'reels-demo-2024' // demo-only accounts on a local database
const VIDEO_DIR = '.pocketbase/seed-videos'

const users = [
  { username: 'maya', name: 'Maya Chen', bio: 'Motion designer. Loops, gradients and good coffee.' },
  { username: 'leo', name: 'Leo Martins', bio: 'Street food and city walks.' },
  { username: 'amira', name: 'Amira Haddad', bio: 'Climbing, film photography, slow travel.' },
]

const reels = [
  { by: 'maya', caption: 'Testing a new gradient loop 🌀', color: '0x1a6fe8' },
  { by: 'leo', caption: 'Sunset run along the river', color: '0xf97316' },
  { by: 'amira', caption: 'First lead climb of the season!', color: '0x16a34a' },
  { by: 'maya', caption: 'Colour study #2: warm to cool', color: '0x9333ea' },
  { by: 'leo', caption: 'Best tacos in town, no debate', color: '0xdc2626' },
  { by: 'amira', caption: 'Morning fog over the valley', color: '0x0891b2' },
]

const comments = [
  'This is so good',
  'Where is this?',
  'The colours 😍',
  'Need more of these',
  'Saving this one',
]

function makeVideo(name, color) {
  const file = join(VIDEO_DIR, `${name}.mp4`)
  if (existsSync(file)) return file
  execFileSync(
    'ffmpeg',
    [
      ['-loglevel', 'error', '-y'],
      ['-f', 'lavfi', '-i', `color=c=${color}:s=540x960:d=4:r=30`],
      ['-f', 'lavfi', '-i', 'testsrc2=s=540x960:d=4:r=30'],
      ['-filter_complex', '[1:v]format=rgba,colorchannelmixer=aa=0.25[o];[0:v][o]overlay'],
      ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file],
    ].flat(),
  )
  return file
}

async function signIn(username) {
  const pb = new PocketBase(POCKETBASE_URL)
  await pb.collection('users').authWithPassword(username, PASSWORD)
  return pb
}

async function main() {
  mkdirSync(VIDEO_DIR, { recursive: true })
  const anon = new PocketBase(POCKETBASE_URL)
  const ids = {}

  for (const user of users) {
    try {
      const record = await anon.collection('users').create({
        ...user,
        email: `${user.username}@example.com`,
        password: PASSWORD,
        passwordConfirm: PASSWORD,
      })
      ids[user.username] = record.id
      console.log(`created user @${user.username}`)
    } catch {
      const record = await anon
        .collection('users')
        .getFirstListItem(anon.filter('username = {:u}', { u: user.username }))
      ids[user.username] = record.id
      console.log(`user @${user.username} already exists`)
    }
  }

  const sessions = Object.fromEntries(
    await Promise.all(users.map(async (u) => [u.username, await signIn(u.username)])),
  )

  const postIds = []
  for (const [index, reel] of reels.entries()) {
    const path = makeVideo(`reel-${index + 1}`, reel.color)
    const video = new File([readFileSync(path)], `reel-${index + 1}.mp4`, { type: 'video/mp4' })
    const post = await sessions[reel.by]
      .collection('posts')
      .create({ author: ids[reel.by], caption: reel.caption, video })
    postIds.push({ id: post.id, by: reel.by })
    console.log(`posted "${reel.caption}"`)
  }

  for (const [index, post] of postIds.entries()) {
    for (const user of users) {
      if (user.username === post.by) continue
      const pb = sessions[user.username]
      if ((index + user.username.length) % 3 !== 0) {
        await pb.collection('likes').create({ post: post.id, author: ids[user.username] })
      }
      await pb.collection('comments').create({
        post: post.id,
        author: ids[user.username],
        content: comments[(index + user.username.length) % comments.length],
      })
    }
  }

  console.log(`\nDone. Log in as maya, leo or amira with password "${PASSWORD}".`)
}

main().catch((error) => {
  console.error(error?.response ?? error)
  process.exit(1)
})

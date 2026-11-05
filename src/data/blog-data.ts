export interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  date: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  comments: Comment[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "the-art-of-storytelling",
    title: "The Art of Storytelling in Modern Writing",
    excerpt: "Exploring how ancient narrative techniques continue to shape contemporary literature and digital content.",
    content: `Stories have been the backbone of human communication since the dawn of civilization. From cave paintings to digital screens, our need to share narratives remains unchanged.

In today's fast-paced world, the art of storytelling has evolved but never diminished. Whether crafting a novel, a blog post, or a social media caption, the fundamental principles remain the same: connect, engage, and transform.

The best stories don't just inform—they transport. They take readers on journeys, introduce them to new perspectives, and leave them changed. This is the magic we, as writers, have the privilege to create.

As I've grown in my craft, I've learned that authenticity trumps perfection. Readers don't want polished prose devoid of soul. They want to feel something real, something human. That vulnerability is what separates good writing from great writing.`,
    date: "2024-01-15",
    readTime: "5 min read",
    image: "https://images.pexels.com/photos/3808057/pexels-photo-3808057.jpeg?auto=compress&cs=tinysrgb&w=800",
    comments: [
      {
        id: "c1",
        author: "Maria Chen",
        email: "maria@example.com",
        content: "This resonated deeply with me. The point about vulnerability being the key to great writing is so true.",
        date: "2024-01-16"
      }
    ]
  },
  {
    id: "2",
    slug: "finding-your-voice",
    title: "Finding Your Voice as a Writer",
    excerpt: "The journey to discovering your unique writing style is both challenging and rewarding.",
    content: `Every writer's journey begins with imitation. We read voraciously, absorbing the styles of those we admire, unconsciously mimicking their rhythms and patterns.

But somewhere along the way, something shifts. Our own voice begins to emerge—tentatively at first, then with growing confidence. It's a voice shaped by our experiences, our worldview, our unique way of seeing.

Finding your voice isn't about being different for the sake of it. It's about being authentically yourself on the page. It's about trusting that your perspective matters, that your stories deserve to be told.

The process takes time. Be patient with yourself. Write regularly. Read widely. And most importantly, don't be afraid to sound like you.`,
    date: "2024-01-08",
    readTime: "4 min read",
    image: "https://images.pexels.com/photos/4065891/pexels-photo-4065891.jpeg?auto=compress&cs=tinysrgb&w=800",
    comments: []
  },
  {
    id: "3",
    slug: "morning-rituals",
    title: "Morning Rituals for Creative Minds",
    excerpt: "How I structure my mornings to maximize creativity and maintain consistent writing habits.",
    content: `The morning hours are sacred. Before the world wakes up with its demands and distractions, there's a window of pure creative potential.

My ritual is simple: wake before dawn, make coffee (always coffee), and write for two hours before checking any device. No emails, no social media, no news. Just words.

This practice has transformed my output. Not because I write more words, but because I write better ones. The early morning mind is uncluttered, still connected to the dreamworld where stories live.

Of course, this won't work for everyone. The key is finding your own creative peak and protecting it fiercely. For some, it's late nights. For others, afternoon hours. Honor what works for you.`,
    date: "2024-01-02",
    readTime: "3 min read",
    image: "https://images.pexels.com/photos/1766604/pexels-photo-1766604.jpeg?auto=compress&cs=tinysrgb&w=800",
    comments: [
      {
        id: "c2",
        author: "James Wright",
        email: "james@example.com",
        content: "I've been trying to implement a similar routine. The no-devices rule is tough but worth it!",
        date: "2024-01-03"
      },
      {
        id: "c3",
        author: "Sophie Adams",
        email: "sophie@example.com",
        content: "Love this! I'm definitely a night owl but the principle of protecting creative time resonates.",
        date: "2024-01-04"
      }
    ]
  }
];

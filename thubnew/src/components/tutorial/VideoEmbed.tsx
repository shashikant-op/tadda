interface VideoEmbedProps {
  url?: string;
}

export function VideoEmbed({ url }: VideoEmbedProps) {
  if (!url) return null;

  return (
    <div className="my-8 overflow-hidden rounded-xl border bg-card shadow">
      <div className="p-4 border-b bg-muted/30 font-semibold text-sm">
        Video Explanation
      </div>
      <div className="relative aspect-video w-full">
        <iframe
          src={url}
          title="Tutorial Video"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

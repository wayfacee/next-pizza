"use client";

import { Api } from "@/shared/services/api-client";
import { IStory } from "@/shared/services/stories";
import React from "react";
import { Container } from "./container";
import { cn } from "@/shared/lib";
import { X } from "lucide-react";
import ReactStories from "react-insta-stories";

interface Props {
  className?: string;
}

export const Stories: React.FC<Props> = ({ className }) => {
  // list of my stories:
  const [stories, setStories] = React.useState<IStory[]>([]);
  const [open, setOpen] = React.useState(false);
  // какой именно сторис решил открыть:
  const [selectedStory, setSelectedStory] = React.useState<IStory>();

  React.useEffect(() => {
    async function fetchStories() {
      const data = await Api.stories.getAll();
      setStories(data);
    }

    fetchStories();
  }, []);

  const onClickStory = (story: IStory) => {
    // story - list of storyItems
    setSelectedStory(story);

    // есть ли в этом стори - айтемы
    if (story.items.length > 0) {
      setOpen(true);
    }
  };

  return (
    <>
      <Container
        className={cn(
          "flex items-center justify-between gap-2 my-10",
          className,
        )}
      >
        {stories.length === 0 &&
          [...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-[200px] h-[250px] bg-gray-200 rounded-md animate-pulse"
            />
          ))}

        {/* preview */}
        {stories.map((story) => (
          <img
            key={story.id}
            onClick={() => onClickStory(story)}
            className="rounded-md cursor-pointer"
            height={250}
            width={200}
            src={story.previewImageUrl}
          />
        ))}

        {open && (
          <div className="absolute left-0 top-0 w-full h-full bg-black/80 flex items-center justify-center z-30">
            {/* React Insta Stories - не может зад. фон делать темным */}
            <div className="relative" style={{ width: 520 }}>
              <button
                className="absolute -right-10 -top-5 z-30"
                onClick={() => setOpen(false)}
              >
                <X className="absolute top-0 right-0 w-8 h-8 text-white/50" />
              </button>

              <ReactStories
                onAllStoriesEnd={() => setOpen(false)} // при заверш. всех сторисов, закрой мод.ок.
                stories={
                  // бери наши сторисы из выбранного, 1 obj - много сториАйтемов
                  selectedStory?.items.map((item) => ({
                    url: item.sourceUrl, // массив обж. ввиде url
                  })) || []
                }
                defaultInterval={3000} // время отображения
                width={520}
                height={800}
              />
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

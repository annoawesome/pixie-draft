import React, { useEffect, useRef, useState } from "react";

import Story, { Stories } from "../type/storyType";
import ContentEditable from "./ContentEditable";
import { RedoIcon, RefreshIcon, UndoIcon } from "./Icons";
import * as endpointProfilesService from "../service/endpointProfilesService";
import * as storiesService from "../service/storiesService";
import Pulse from "./Pulse";
import Endpoint from "../type/endpointType";
import SquareButtonContainer from "./SquareButtonContainer";
import CenterPanel from "./CenterPanel";
import { KoboldCppClient } from "../client/koboldCppClient";
import { LlmEndpointClient } from "../type/llmEndpointClient";
import { NoLlmClient } from "../client/noLlmClient";
import { isStreamableEndpoint } from "../type/streamableEndpoint";

function ActionBar({
  contentEditableRef,
  endpointProfile,
  selectedStory,
  stories,
  locked,
  setLocked,
  setStories,
}: {
  contentEditableRef: React.RefObject<HTMLDivElement | null>;
  endpointProfile: Endpoint | null;
  selectedStory: Story;
  stories: Stories;
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  setStories: React.Dispatch<React.SetStateAction<Stories>>;
}) {
  const [modelLoaded, setModelLoaded] = useState("");

  let llmEndpointClient: LlmEndpointClient = new NoLlmClient();

  if (endpointProfile) {
    llmEndpointClient = new KoboldCppClient(
      endpointProfile.uri,
      endpointProfile.authorization,
    );
  }

  const generate = async (stories: Stories) => {
    const story = storiesService.getSelectedStory(stories);

    if (!story) {
      alert("No story loaded to generate with");
      return;
    }

    if (!endpointProfile) {
      alert("No LLM endpoint is connected");
      return;
    }

    setLocked(true);

    try {
      const content = story.content;

      let text = "";

      // If there is streaming support, please use the streaming
      if (isStreamableEndpoint(llmEndpointClient)) {
        const responseStream =
          llmEndpointClient.generateResponseStream(content);

        text = await responseStream.open((token) => {
          setStories((oldStories) => {
            const updatedStories =
              storiesService.locallyUpdateSelectedStoryContentByAppendingToken(
                oldStories,
                token,
              );

            if (updatedStories) {
              return updatedStories;
            } else {
              return oldStories;
            }
          });
        });
      } else {
        text = await llmEndpointClient.generateResponse(content);
      }

      const updatedStories =
        await storiesService.updateSelectedStoryContentAndSave(
          stories,
          content + text,
          true,
        );

      if (updatedStories) {
        setStories(updatedStories);
      }

      // There is probably a better way to do this
      setTimeout(() => {
        if (contentEditableRef.current) {
          contentEditableRef.current.scrollTo(
            0,
            contentEditableRef.current.scrollHeight,
          );
        }
      }, 100);
    } catch {
      /* empty */
    }

    setLocked(false);
  };

  const onGenerate = () => {
    generate(stories);
  };

  const onClickUndo = async () => {
    const updatedStories =
      await storiesService.undoSelectedStoryAndSave(stories);

    if (updatedStories) {
      setStories(updatedStories);
    }
  };

  const onClickRedo = async () => {
    const updatedStories =
      await storiesService.redoSelectedStoryAndSave(stories);

    if (updatedStories) {
      setStories(updatedStories);
    }
  };

  const onClickRetry = () => {
    const updatedStories =
      storiesService.locallyUpdateSelectedStoryFromTreeBacktrack(stories);

    if (updatedStories) {
      setStories(updatedStories);
      const updatedStory = storiesService.getSelectedStory(updatedStories);

      if (updatedStory) {
        generate(updatedStories);
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!endpointProfile) return;

      llmEndpointClient
        .fetchModel()
        .then(setModelLoaded)
        .catch(() => setModelLoaded(""));
    }, 5e3);

    return () => clearInterval(intervalId);
  }, [endpointProfile]);

  return (
    <div className="flex-row width-fill-max" id="action-bar">
      <div className="flex-row width-fill-max" id="action-bar-left">
        <SquareButtonContainer>
          <button
            className="button-secondary button-icon"
            type="button"
            disabled={selectedStory.historyIndex === 0 || locked}
            onClick={onClickUndo}
          >
            <UndoIcon />
          </button>
        </SquareButtonContainer>
        <SquareButtonContainer>
          <button
            className="button-secondary button-icon"
            type="button"
            disabled={
              selectedStory.historyIndex === selectedStory.history.length - 1 ||
              locked
            }
            onClick={onClickRedo}
          >
            <RedoIcon />
          </button>
        </SquareButtonContainer>
        <SquareButtonContainer>
          <button
            className="button-secondary button-icon"
            type="button"
            disabled={
              !modelLoaded ||
              !storiesService.regeneratable(selectedStory) ||
              locked
            }
            onClick={onClickRetry}
          >
            <RefreshIcon />
          </button>
        </SquareButtonContainer>
      </div>
      <div className="flex-row-right width-fill-max" id="action-bar-right">
        <button
          className="button-primary"
          type="button"
          disabled={!modelLoaded || locked}
          onClick={onGenerate}
        >
          Generate
        </button>
        <div className="flex-row" id="endpoint-status-indicator">
          <Pulse
            active={modelLoaded.length > 0}
            title={
              modelLoaded
                ? `${endpointProfile?.name}\n${modelLoaded}`
                : "Unable to find model"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default function Editor({
  stories,
  setStories,
}: {
  stories: Stories;
  setStories: React.Dispatch<React.SetStateAction<Stories>>;
}) {
  const [locked, setLocked] = useState(false);
  const [endpointProfile, setEndpointProfile] = useState<Endpoint | null>(null);

  const contentEditableRef = useRef<HTMLDivElement | null>(null);

  const onChangeStoryTitle = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const updatedStories = storiesService.locallyUpdateSelectedStoryTitle(
      stories,
      e.target.value,
    );

    if (updatedStories) {
      setStories(updatedStories);
    }
  };

  const onBlurStoryTitle = () => {
    storiesService.saveSelectedStory(stories);
  };

  const onBlurStoryContent = async (newContent: string) => {
    if (selectedStory?.content === newContent) return;

    // A hack to hopefully prevent what appears to be a rare race condition
    // where you press "generate" before the app finishes saving
    setLocked(true);

    const updatedStories =
      await storiesService.updateSelectedStoryContentAndSave(
        stories,
        newContent,
      );

    if (updatedStories) {
      setStories(updatedStories);
    }

    setLocked(false);
  };

  useEffect(() => {
    endpointProfilesService
      .fetchEndpointFromEndpointProfiles()
      .then(setEndpointProfile);
  }, []);

  const selectedStory = storiesService.getSelectedStory(stories);

  useEffect(() => {
    if (!contentEditableRef.current) return;

    contentEditableRef.current.scrollTop =
      contentEditableRef.current.scrollHeight;
  }, [selectedStory?.id]);

  return (
    <div className="flex-column gap-medium" id="editor">
      {selectedStory ? (
        <>
          <input
            type="text"
            className="input-secondary"
            id="story-title"
            autoComplete="false"
            placeholder="Story Title"
            value={selectedStory?.title}
            onChange={onChangeStoryTitle}
            onBlur={onBlurStoryTitle}
          />
          <ContentEditable
            id="story-content"
            value={selectedStory.content}
            onUpdate={onBlurStoryContent}
            locked={locked}
            ref={contentEditableRef}
          />
          <ActionBar
            contentEditableRef={contentEditableRef}
            endpointProfile={endpointProfile}
            selectedStory={selectedStory}
            stories={stories}
            locked={locked}
            setLocked={setLocked}
            setStories={setStories}
          />
        </>
      ) : (
        <CenterPanel>
          <p>
            No story selected. Select a story from the library or create a new
            one.
          </p>
        </CenterPanel>
      )}
    </div>
  );
}

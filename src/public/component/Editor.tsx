import React, { useEffect, useRef, useState } from "react";

// import { saveStory } from "../api/storiesApi";

import Story, {
  getCurrentHistoryNode,
  mutateStoryFromAppendingHistory,
  mutateStoryFromHistoryPageFlip,
  mutateStoryFromTreeBacktrack,
  mutateStoryTitle,
  updateStoriesFromUpdatedStory,
} from "../type/storyType";
import { fetchModel, generateResponse } from "../api/koboldCppApi";
import ContentEditable from "./ContentEditable";
import { RedoIcon, RefreshIcon, UndoIcon } from "./Icons";
import * as endpointProfilesService from "../service/endpointProfilesService";
import Pulse from "./Pulse";
import Endpoint from "../type/endpointType";
import { storiesClient } from "../client/storiesClient";

function ActionBar({
  contendEditableRef,
  endpointProfile,
  selectedStory,
  locked,
  setSelectedStory,
  setLocked,
}: {
  contendEditableRef: React.RefObject<HTMLDivElement | null>;
  endpointProfile: Endpoint | null;
  selectedStory: Story;
  locked: boolean;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [modelLoaded, setModelLoaded] = useState("");
  const generate = (story: Story) => {
    if (!story) {
      alert("No story loaded to generate with");
      return;
    }

    if (!endpointProfile) {
      alert("No LLM endpoint is connected");
      return;
    }

    setLocked(true);

    // call LLM api
    generateResponse(
      endpointProfile.uri,
      story.content,
      endpointProfile.authorization,
    )
      .then((text) => {
        const mutatedStory = mutateStoryFromAppendingHistory(
          story,
          story.content + text,
          true,
        );

        setSelectedStory(mutatedStory);
        storiesClient.saveStory(mutatedStory);

        // There is probably a better way to do this
        setTimeout(() => {
          if (contendEditableRef.current) {
            contendEditableRef.current.scrollTo(
              0,
              contendEditableRef.current.scrollHeight,
            );
          }
        }, 100);
      })
      .finally(() => setLocked(false));
  };

  const onGenerate = () => {
    generate(selectedStory);
  };

  const onClickUndo = () => {
    const mutatedStory = mutateStoryFromHistoryPageFlip(selectedStory, true);

    setSelectedStory(mutatedStory);
    storiesClient.saveStory(mutatedStory);
  };

  const onClickRedo = () => {
    const mutatedStory = mutateStoryFromHistoryPageFlip(selectedStory, false);

    setSelectedStory(mutatedStory);
    storiesClient.saveStory(mutatedStory);
  };

  const onClickRetry = () => {
    const mutatedStory = mutateStoryFromTreeBacktrack(selectedStory);

    setSelectedStory(mutatedStory);
    generate(mutatedStory);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!endpointProfile) return;

      fetchModel(endpointProfile.uri)
        .then(setModelLoaded)
        .catch(() => setModelLoaded(""));
    }, 5e3);

    return () => clearInterval(intervalId);
  }, [endpointProfile]);

  return (
    <div className="flex-row width-fill-max" id="action-bar">
      <div className="flex-row width-fill-max" id="action-bar-left">
        <button
          className="button-secondary button-icon"
          type="button"
          disabled={selectedStory.historyIndex === 0 || locked}
          onClick={onClickUndo}
        >
          <UndoIcon />
        </button>
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
        <button
          className="button-secondary button-icon"
          type="button"
          disabled={
            selectedStory.historyIndex === 0 ||
            !getCurrentHistoryNode(selectedStory).attributes.generatedByLlm ||
            locked
          }
          onClick={onClickRetry}
        >
          <RefreshIcon />
        </button>
      </div>
      <div className="flex-row-right width-fill-max" id="action-bar-right">
        <button
          className="button-primary"
          type="button"
          disabled={locked}
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
  selectedStory,
  stories,
  setSelectedStory,
  setStories,
}: {
  selectedStory: Story | null;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  const [locked, setLocked] = useState(false);
  const [endpointProfile, setEndpointProfile] = useState<Endpoint | null>(null);

  const contendEditableRef = useRef<HTMLDivElement | null>(null);

  const onChangeStoryTitle = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setSelectedStory((prev) =>
      prev ? mutateStoryTitle(prev, e.target.value) : null,
    );
  };

  const onBlurStoryTitle = () => {
    if (selectedStory) {
      storiesClient.saveStory(selectedStory);
      setStories(updateStoriesFromUpdatedStory(stories, selectedStory));
    }
  };

  const onBlurStoryContent = (newContent: string) => {
    if (selectedStory) {
      const mutatedStory = mutateStoryFromAppendingHistory(
        selectedStory,
        newContent,
        false,
      );

      setSelectedStory(mutatedStory);
      storiesClient.saveStory(selectedStory);
    }
  };

  useEffect(() => {
    endpointProfilesService
      .fetchEndpointFromEndpointProfiles()
      .then(setEndpointProfile);
  }, []);

  return (
    <div className="flex-column width-fill-max" id="editor">
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
            value={selectedStory.content}
            onUpdate={onBlurStoryContent}
            locked={locked}
            ref={contendEditableRef}
          />
          <ActionBar
            contendEditableRef={contendEditableRef}
            endpointProfile={endpointProfile}
            selectedStory={selectedStory}
            locked={locked}
            setSelectedStory={setSelectedStory}
            setLocked={setLocked}
          />
        </>
      ) : (
        <p>No story selected</p>
      )}
    </div>
  );
}

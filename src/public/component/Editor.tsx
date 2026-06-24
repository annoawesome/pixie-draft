import React, { useEffect, useRef, useState } from "react";

import Story, {
  getCurrentHistoryNode,
  mutateStoryFromTreeBacktrack,
  mutateStoryTitle,
  updateStoriesFromUpdatedStory,
} from "../type/storyType";
import { fetchModel, generateResponse } from "../api/koboldCppApi";
import ContentEditable from "./ContentEditable";
import { RedoIcon, RefreshIcon, UndoIcon } from "./Icons";
import * as endpointProfilesService from "../service/endpointProfilesService";
import * as storiesService from "../service/storiesService";
import Pulse from "./Pulse";
import Endpoint from "../type/endpointType";
import { storiesClient } from "../client/storiesClient";
import SquareButtonContainer from "./SquareButtonContainer";

function ActionBar({
  contendEditableRef,
  endpointProfile,
  selectedStory,
  locked,
  setSelectedStory,
  setLocked,
  setStories,
}: {
  contendEditableRef: React.RefObject<HTMLDivElement | null>;
  endpointProfile: Endpoint | null;
  selectedStory: Story;
  locked: boolean;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  const [modelLoaded, setModelLoaded] = useState("");
  const generate = async (story: Story) => {
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
      // call LLM api
      const text = await generateResponse(
        endpointProfile.uri,
        story.content,
        endpointProfile.authorization,
      );

      const updatedStory = await storiesService.updateStoryContentAndSave(
        story,
        story.content + text,
        true,
      );

      setSelectedStory(updatedStory);
      setStories((stories) =>
        storiesService.repushStoryToTopOfStories(stories, updatedStory),
      );

      // There is probably a better way to do this
      setTimeout(() => {
        if (contendEditableRef.current) {
          contendEditableRef.current.scrollTo(
            0,
            contendEditableRef.current.scrollHeight,
          );
        }
      }, 100);
    } catch {
      /* empty */
    }

    setLocked(false);
  };

  const onGenerate = () => {
    generate(selectedStory);
  };

  const onClickUndo = async () => {
    const updatedStory = await storiesService.undoStoryAndSave(selectedStory);

    setSelectedStory(updatedStory);
    setStories((stories) =>
      storiesService.repushStoryToTopOfStories(stories, updatedStory),
    );
  };

  const onClickRedo = async () => {
    const updatedStory = await storiesService.redoStoryAndSave(selectedStory);

    setSelectedStory(updatedStory);
    setStories((stories) =>
      storiesService.repushStoryToTopOfStories(stories, updatedStory),
    );
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
              selectedStory.historyIndex === 0 ||
              !getCurrentHistoryNode(selectedStory).attributes.generatedByLlm ||
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

  const onBlurStoryContent = async (newContent: string) => {
    if (!selectedStory) return;

    const updatedStory = await storiesService.updateStoryContentAndSave(
      selectedStory,
      newContent,
    );

    const updatedStories = storiesService.repushStoryToTopOfStories(
      stories,
      updatedStory,
    );

    setSelectedStory(updatedStory);
    setStories(updatedStories);
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
            setStories={setStories}
          />
        </>
      ) : (
        <p>No story selected</p>
      )}
    </div>
  );
}

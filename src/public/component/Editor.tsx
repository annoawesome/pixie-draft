import React, { useContext, useEffect, useRef, useState } from "react";

import Story, { Stories } from "../type/storyType";
import ContentEditable from "./ContentEditable";
import {
  PaperAirplaneIcon,
  RedoIcon,
  RefreshIcon,
  ServerIcon,
  UndoIcon,
} from "./Icons";
import * as endpointProfilesService from "../service/endpointProfilesService";
import * as storiesService from "../service/storiesService";
import Pulse from "./Pulse";
import Endpoint from "../type/endpointType";
import SquareButtonContainer from "./SquareButtonContainer";
import CenterPanel from "./CenterPanel";
import { LlmEndpointClient } from "../type/llmEndpointClient";
import { NoLlmClient } from "../client/llms/noLlmClient";
import { isStreamableEndpoint } from "../type/streamableEndpoint";
import Popover from "./Popover";
import { NotificationContext } from "./NotificationProvider";
import { humanReadableError } from "../service/displayErrorService";
import { secondsToMilliseconds } from "../util/time";

function MainEditorEndpointMenu({
  endpoint,
  models,
  selectedModel,
  setSelectedModel,
}: {
  endpoint: Endpoint | null;
  models: string[];
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
}) {
  const endpointName = endpoint?.name || "No endpoint connected";

  const onChangeSelectedModel = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedModel(event.target.value);
  };

  return (
    <Popover id="main-editor-endpoint-menu">
      <div className="flex-column gap-medium">
        <h1>{endpointName}</h1>

        <div className="flex-column">
          <label className="text-secondary">Status</label>
          <p>{models.length > 0 ? "Online" : "Offline"}</p>
        </div>

        <div className="flex-column">
          <label htmlFor="selected-model" className="text-secondary">
            Selected model
          </label>
          <select
            name="selected-model"
            className="input-secondary"
            id=""
            value={selectedModel}
            onChange={onChangeSelectedModel}
          >
            {models.map((model, index) => (
              <option value={model} key={index}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Popover>
  );
}

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
  const [modelsLoaded, setModelsLoaded] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");

  const notificationContextObject = useContext(NotificationContext);

  let llmEndpointClient: LlmEndpointClient = new NoLlmClient();

  if (endpointProfile) {
    llmEndpointClient =
      endpointProfilesService.getClientFromEndpointProfile(endpointProfile);
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
        try {
          text = await llmEndpointClient.generateResponse(
            content,
            selectedModel,
          );
        } catch (error) {
          console.error(error);
        }
      }

      const result = await storiesService.updateSelectedStoryContentAndSave(
        stories,
        content + text,
        true,
      );

      result.match({
        Ok: function (updatedStories: Stories): void {
          setStories(updatedStories);
        },
        Err: function (error: Error): void {
          console.error(error);
          notificationContextObject.setNotification(humanReadableError(error));
        },
      });

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
    const result = await storiesService.undoSelectedStoryAndSave(stories);

    result.match({
      Ok: function (updatedStories: Stories): void {
        setStories(updatedStories);
      },
      Err: function (error: Error): void {
        console.error(error);
        notificationContextObject.setNotification(humanReadableError(error));
      },
    });
  };

  const onClickRedo = async () => {
    const result = await storiesService.redoSelectedStoryAndSave(stories);

    result.match({
      Ok: function (updatedStories: Stories): void {
        setStories(updatedStories);
      },
      Err: function (error: Error): void {
        console.error(error);
        notificationContextObject.setNotification(humanReadableError(error));
      },
    });
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
    const intervalId = setInterval(async () => {
      if (!endpointProfile) return;

      try {
        const models = await llmEndpointClient.fetchModels();
        setModelsLoaded(models);

        if (models.length > 0) {
          setSelectedModel((model) => {
            return model || models[0];
          });
        }
      } catch {
        setModelsLoaded([]);
        setSelectedModel("");
      }
    }, secondsToMilliseconds(5));

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
              !selectedModel ||
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
          className="button-primary hide-on-mobile"
          type="button"
          disabled={!selectedModel || locked}
          onClick={onGenerate}
        >
          Generate
        </button>
        <SquareButtonContainer className="display-on-mobile">
          <button
            className="button-primary button-icon"
            type="button"
            disabled={!selectedModel || locked}
            onClick={onGenerate}
          >
            <PaperAirplaneIcon />
          </button>
        </SquareButtonContainer>
        <button
          className="flex-row button-secondary"
          id="endpoint-status-indicator"
          popoverTarget="main-editor-endpoint-menu"
        >
          <Pulse
            active={selectedModel.length > 0}
            title={
              selectedModel
                ? `${endpointProfile?.name}\n${selectedModel}`
                : "Unable to find model"
            }
          />
          <ServerIcon />
        </button>
        <MainEditorEndpointMenu
          endpoint={endpointProfile}
          models={modelsLoaded}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
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

  const notificationContextObject = useContext(NotificationContext);

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

  const onBlurStoryTitle = async () => {
    const result = await storiesService.saveSelectedStory(stories);

    result.match({
      Ok: function (): void {
        // TODO: Handle success
      },
      Err: function (error: Error): void {
        console.error(error);
        notificationContextObject.setNotification(humanReadableError(error));
      },
    });
  };

  const onBlurStoryContent = async (newContent: string) => {
    if (selectedStory?.content === newContent) return;

    // A hack to hopefully prevent what appears to be a rare race condition
    // where you press "generate" before the app finishes saving
    setLocked(true);

    const result = await storiesService.updateSelectedStoryContentAndSave(
      stories,
      newContent,
    );

    result.match({
      Ok: function (updatedStories: Stories): void {
        setStories(updatedStories);
      },
      Err: function (error: Error): void {
        console.error(error);
        notificationContextObject.setNotification(humanReadableError(error));
      },
    });

    setLocked(false);
  };

  useEffect(() => {
    const fetchEndpoint = async () => {
      const result =
        await endpointProfilesService.fetchEndpointFromEndpointProfiles();

      result.match({
        Ok: setEndpointProfile,
        Err: function (error: Error): void {
          console.error(error);
          notificationContextObject.setNotification(humanReadableError(error));
        },
      });
    };

    fetchEndpoint();
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

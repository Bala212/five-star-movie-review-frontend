import React from "react";
import ModalContainer from "./ModalContainer";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

//same as writerModal to display them, just extra is that roleAs and leadActor

export default function CastModal({
  casts = [],
  visible,
  onClose,
  onRemoveClick,
}) {
  if (!visible) return null;
  return (
    <ModalContainer ignoreContainer onClose={onClose} visible={visible}>
      <div
        className="space-y-2 dark:bg-primary  bg-white rounded max-w-[45rem] max-h-[39rem]
      overflow-auto p-2 custom-scroll-bar"
      >
        {/* display profile one by one!! */}
        {casts.map(({ profile, roleAs, leadActor }) => {
          const { name, avatar, id } = profile;
          return (
            <div
              key={id}
              className="flex space-x-3 dark:bg-secondary
                bg-white drop-shadow-md rounded"
            >
              <img
                className="w-16 h-16 aspect-square rounded object-cover"
                src={avatar}
                alt={name}
              />
              <div className="flex flex-col justify-between py-1">
                <div>
                  <p className="w-full font-semibold dark:text-white text-primary">
                    {name}
                  </p>
                  <p className="text-sm dark:text-dark-subtle text-light-subtle">
                    {roleAs}
                  </p>
                </div>
                {/* icon of tick, if it is a leadActor */}
                {leadActor && (
                  <AiOutlineCheck className="text-light-subtle dark:text-dark-subtle" />
                )}
              </div>
              <button
                // 'onRemoveClick' is a callBack function!!!! which has come as an prop from
                //'MovieForm' under 'WritersModal'
                onClick={() => onRemoveClick(id)}
                className="dark:text-white text-primary hover:opacity-80 transition p-2"
              >
                <AiOutlineClose />
              </button>
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
}

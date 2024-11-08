import Image from "next/image";
import React, { useRef } from "react";
import FormLink from "~/utils/FormLink";
import * as PrintTip from "../../public/howToPrint.png";
import useModalControl from "~/hooks/useModalControl";
import { Router } from "next/router";
import Link from "next/link";
import { AuthClient } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import deleteUser from "~/services/backend/userManagement/deleteUser";
import CloseIcon from "./icons/CloseIcon";
import Spacer from "./utility/Spacer";

interface Props {
  showContact: boolean;
  setShowContact: React.Dispatch<React.SetStateAction<boolean>>;
  controlButtonRef: React.RefObject<HTMLButtonElement>;
  onLogout: () => void;
}

const HelpModal = ({
  showContact,
  setShowContact,
  controlButtonRef,
  onLogout,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const deleteUserRef = useRef<HTMLDialogElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  useModalControl(ref, showContact, setShowContact, controlButtonRef);

  const handleDeleteUser = async () => {
    await deleteUser();
    onLogout();
    window.localStorage.clear();
  };

  return (
    <div
      ref={ref}
      style={{
        scale: showContact ? 1 : 0,
        opacity: showContact ? 1 : 0,
        transformOrigin: "bottom right",
        transition: "all 0.150s ease",
      }}
      className="absolute  bottom-10 right-5 z-10 h-auto flex-col items-center justify-center overflow-hidden rounded-[10px] bg-white text-base shadow-xl md:text-base dark:bg-darkTextInputBackground"
    >
      <button
        tabIndex={showContact ? 0 : -1}
        className="h-16 w-60 bg-white text-primary transition-all duration-150 hover:bg-seperatorSecondary dark:bg-darkTextInputBackground"
      >
        <a
          tabIndex={showContact ? 0 : -1}
          target="_blank"
          rel="noopener noreferrer"
          href={FormLink}
        >
          Provide Feedback
        </a>
      </button>
      <div className="absolute h-[1px] w-full bg-seperatorSecondary dark:bg-darkSeperatorSecondary" />
      <button
        tabIndex={showContact ? 0 : -1}
        className="h-16 w-60 bg-white text-primary transition-all duration-150 hover:bg-seperatorSecondary dark:bg-darkTextInputBackground"
        onClick={() => {
          setShowContact(false);
          dialogRef.current?.showModal();
        }}
      >
        Teach me how to print
      </button>
      <div className="absolute h-[1px] w-full bg-seperatorSecondary dark:bg-darkSeperatorSecondary" />
      <Link href={"/privacy-policy.html"}>
        <button
          tabIndex={showContact ? 0 : -1}
          className="h-16 w-60 bg-white text-primary transition-all duration-150 hover:bg-seperatorSecondary dark:bg-darkTextInputBackground"
        >
          Privacy Policy
        </button>
      </Link>
      <div className="absolute h-[1px] w-full bg-seperatorSecondary dark:bg-darkSeperatorSecondary" />
      <button
        tabIndex={showContact ? 0 : -1}
        className="h-16 w-60 bg-white text-red-500 transition-all duration-150 hover:bg-seperatorSecondary dark:bg-darkTextInputBackground"
        onClick={() => {
          setShowContact(false);
          deleteUserRef.current?.showModal();
        }}
      >
        Delete User
      </button>
      <div className="absolute h-[1px] w-full bg-seperatorSecondary dark:bg-darkSeperatorSecondary" />
      <button
        tabIndex={showContact ? 0 : -1}
        className="h-16 w-60 bg-white text-red-500 transition-all duration-150 hover:bg-seperatorSecondary dark:bg-darkTextInputBackground"
        onClick={onLogout}
      >
        Logout
      </button>

      <dialog
        ref={dialogRef}
        className="h-3/4 w-[90%] overflow-x-hidden rounded-[10px] p-4 shadow-xl transition-all duration-150 md:h-3/5 md:w-1/4 dark:bg-darkSecondaryBackground"
      >
        <div className="flex h-full flex-1 flex-col items-center justify-between">
          <h4 className="md:w-3/4">
            After clicking <b>ctrl + P</b> or <b>cmd + P</b> make sure to{" "}
            <u>unselect</u> "Headers and Footers".
          </h4>
          <Image src={PrintTip} className="rounded-[10px]" alt="How to print" />
          <button
            tabIndex={showContact ? 0 : -1}
            onClick={() => dialogRef.current?.close()}
            className="self-center rounded-[10px] bg-primary p-3 text-white transition-all duration-150 active:scale-95 md:p-4"
          >
            Got it!
          </button>
        </div>
      </dialog>
      <dialog
        ref={deleteUserRef}
        className="w-[90%] overflow-x-hidden rounded-[10px] p-4 shadow-xl transition-all duration-150 md:w-2/6 dark:bg-darkSecondaryBackground"
      >
        <div className="flex h-full flex-1 flex-col items-center justify-start gap-4 text-center">
          <h3>Your'e about to delete your account!</h3>
          <p>You will lose your data permanently. Are you sure?</p>
          <div className="flex flex-row gap-4">
            <button
              onClick={() => deleteUserRef.current?.close()}
              className="rounded-[10px] bg-primary p-3 text-white"
            >
              No, I'll stay for a bit longer
            </button>

            <button
              onClick={handleDeleteUser}
              className="rounded-[10px] border-2 border-red-500 p-3 text-red-500 transition-colors duration-150 hover:bg-red-500 hover:text-white"
            >
              Yes, Delete my account
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default React.memo(HelpModal);

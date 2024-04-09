import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../context/user-context";
import './index.scss';

export default function Notification(props: any) {
  const { user, setUser } = useContext(UserContext);
  const navigate: any = useNavigate();

  return (
    <div className="notification-popup"></div>
  );
}

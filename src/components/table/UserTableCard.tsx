import { User } from "@/interface/user";
import { cn } from "@/utils";
import AppAvatar from "@molecule/Avatar";

interface Props {
  user: User;
}

export default function UserTableCard(props: Props) {
  return (
    <div className={cn(`flex gap-x-3 items-center`)}>
      <AppAvatar src={props.user.avatar} name={props.user.name} />
      <div className={"flex flex-col min-w-[15ch]"}>
        <p>{props.user.name}</p>
        <p className={"break-all"}>{props.user.email}</p>
      </div>
    </div>
  );
}

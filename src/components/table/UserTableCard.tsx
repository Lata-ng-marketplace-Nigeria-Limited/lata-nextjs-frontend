import { User } from "@/interface/user";
import { cn } from "@/utils";
import AppAvatar from "@molecule/Avatar";

interface Props {
  user?: User | null;
}

export default function UserTableCard({ user }: Props) {
  if (!user) {
    return (
      <div className={cn(`flex gap-x-3 items-center`)}>
        <AppAvatar src={undefined} name="Unknown" />
        <div className={"flex flex-col min-w-[15ch]"}>
          <p className="text-sm text-grey5 italic">Unknown User</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(`flex gap-x-3 items-center`)}>
      <AppAvatar src={user.avatar} name={user.name} />
      <div className={"flex flex-col min-w-[15ch]"}>
        <p>{user.name}</p>
        <p className={"break-all text-xs text-grey6"}>{user.email}</p>
      </div>
    </div>
  );
}

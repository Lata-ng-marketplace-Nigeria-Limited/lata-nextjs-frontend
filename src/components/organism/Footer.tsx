import { cn } from "@/utils";
import {
  footer,
  footerContactUs,
  footerDownloadApps,
} from "@/store/data/footer";
import {DateTime} from "luxon";
import FooterSubscribeArea from "@/components/molecule/FooterSubscribeArea";
import FooterList from "@/components/molecule/FooterList";

const Footer = () => {
  // const { size, setRef } = useElementSize();

  // createEffect(() => {
  //   setDimensionState({
  //     footer: size(),
  //   });
  // });

  return (
    <footer
      className={cn(`
        bg-primary
        pt-6
        tablet:pt-[3rem]
        lg:pt-[4.5rem]
        xl:pt-[6.875rem]
        pb-[2.5rem]
        tablet:pb-4.5rem]
        px-6
        tablet:px-[2.5rem]
        lg:px-[4.5rem]
        xl:px-[6.875rem]
      `)}
    >
      <div
        className={cn(`
          flex
          justify-between
          gap-x-4
          gap-y-6
          flex-col
          sm:flex-row
        `)}
      >
        <FooterSubscribeArea />
        <FooterList links title={"About Us"} list={footer} />
        <FooterList title={"Contact Us"} list={footerContactUs} />
        <FooterList title={"Download App"} list={footerDownloadApps} />
      </div>

      <p
        className={cn(`
          text-grey5
          text-center
          text-xs
          tablet:text-sm
          mt-[2.5rem]
          sm:mt-[5rem]
          tablet:mt-[9.375rem]
        `)}
      >
        {DateTime.now().toFormat('yyyy')} LATA.ng
      </p>
    </footer>
  );
};

export default Footer;

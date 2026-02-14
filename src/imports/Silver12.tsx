import imgSilver500Big1 from "figma:asset/81aece5f7a62ab565472eca665190190e73640f2.png";

function Component() {
  return (
    <div className="content-stretch flex items-center p-[10px] relative shrink-0" data-name="12">
      <div className="relative shrink-0 size-[1046px]" data-name="silver500big 1">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgSilver500Big1} />
      </div>
    </div>
  );
}

export default function Silver() {
  return (
    <div className="content-stretch flex items-center p-[10px] relative size-full" data-name="silver12">
      <Component />
    </div>
  );
}
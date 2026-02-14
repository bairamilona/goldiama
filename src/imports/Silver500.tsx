import imgSilver500Big1 from "figma:asset/6a86446f98c0d25849c0824244447642cee4810b.png";

function Component() {
  return (
    <div className="content-stretch flex items-center p-[10px] relative shrink-0" data-name="500">
      <div className="relative shrink-0 size-[1046px]" data-name="silver500big 1">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgSilver500Big1} />
      </div>
    </div>
  );
}

export default function Silver() {
  return (
    <div className="content-stretch flex items-center p-[10px] relative size-full" data-name="silver500">
      <Component />
    </div>
  );
}
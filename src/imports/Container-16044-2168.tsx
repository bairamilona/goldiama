import imgImageTheEagleOfTrust from "figma:asset/77ab9fe8a8f02de02bbf9a31c7b5b29dcaa635fe.png";

function ImageTheEagleOfTrust() {
  return (
    <div className="relative shrink-0 size-[340px]" data-name="Image (The Eagle of Trust)">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageTheEagleOfTrust} />
    </div>
  );
}

function Picture() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Picture">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[24px] relative size-full">
          <ImageTheEagleOfTrust />
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[3px] relative w-full">
          <p className="font-['Cormorant_Garamond:Regular',sans-serif] leading-[25px] not-italic relative shrink-0 text-[#101828] text-[20px] text-center tracking-[-0.5px]">The Eagle of Trust</p>
        </div>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] not-italic relative shrink-0 text-[#6a7282] text-[9px] text-center tracking-[0.45px] uppercase">50 GRAM MINTED GOLD COIN</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[42.5px] relative shrink-0 w-[141.672px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative w-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#99a1af] text-[10px] text-center tracking-[0.5px] uppercase">Purity</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] not-italic relative shrink-0 text-[#101828] text-[10px] text-center">999.9</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[15px] relative shrink-0 w-[71.789px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Text />
        <Text1 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[#d1d5dc] h-[20px] relative shrink-0 w-px" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid size-full" />
    </div>
  );
}

function Text2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative w-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#99a1af] text-[10px] text-center tracking-[0.5px] uppercase">Weight</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] not-italic relative shrink-0 text-[#101828] text-[10px] text-center">50g</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[15px] relative shrink-0 w-[65.883px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Text2 />
        <Text3 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[#d1d5dc] h-[20px] relative shrink-0 w-px" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid size-full" />
    </div>
  );
}

function Text4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[27px] not-italic relative shrink-0 text-[#101828] text-[18px] text-center">$8,000.00</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[27px] relative shrink-0 w-[279.859px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container4 />
        <Container5 />
        <Container6 />
        <Container7 />
        <Text4 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center pb-[24px] relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute bg-[rgba(184,160,126,0.1)] content-stretch flex h-[18.5px] items-start left-[16px] px-[12px] py-[4px] rounded-[16777200px] top-[21px] w-[70.523px]" data-name="Text">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[13.5px] not-italic relative shrink-0 text-[#b8a07e] text-[9px] tracking-[0.45px] uppercase">In Stock</p>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[#fafaf8] content-stretch flex flex-col items-start relative rounded-[24px] size-full" data-name="Container">
      <Picture />
      <Container1 />
      <Text5 />
    </div>
  );
}
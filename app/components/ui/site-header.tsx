const SiteHeader = () => {
  return (
    <div className="relative pb-14">
      <h1 className="text-4xl md:text-5xl font-black text-center relative z-10">
        Power Up Your{" "}
        <span className="inline-block relative">
          <span className=" bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Links
          </span>
          <span className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-400 opacity-50 rounded-full blur-sm"></span>
        </span>{" "}
        Today
      </h1>
    </div>
  );
};

export default SiteHeader;

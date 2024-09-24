import { removeExtraChunkAtStart } from "@/server/api/routers/checker/rmChainOfThought";
import {
  resumeWithChainOfThought,
  sample_resume_2019,
} from "scripts/samples/rizzume";

console.log(
  removeExtraChunkAtStart(sample_resume_2019, resumeWithChainOfThought),
);

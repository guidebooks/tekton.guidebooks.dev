/*
 * Copyright 2019 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Capabilities, Registrar } from "@kui-shell/core"

import getStep from "./controller/get/step"
import getTask from "./controller/get/task"
import preview from "./controller/preview"

export default async (registrar: Registrar) => {
  /**
   * Playground that listens for edits on the provided channel
   *    tekton playground <channel>
   *
   */
  registrar.listen(
    "/tekton/playground",
    async (args) => import("./view/Playground").then(async (_) => ({ react: await _.listenOnChannel(args) })),
    {
      needsUI: true,
    }
  )

  /**
   * Playground for a given filepath
   *    tekton playground file <filepath>
   *
   */
  registrar.listen(
    "/tekton/playground/file",
    async (args) => import("./view/Playground").then(async (_) => ({ react: await _.readFromFile(args) })),
    {
      needsUI: true,
      outputOnly: true,
    }
  )

  if (!Capabilities.isHeadless() || Capabilities.inProxy()) {
    await Promise.all([getStep(registrar), getTask(registrar), preview(registrar)])
  }
}

-- CreateTable
CREATE TABLE "savePost" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "savePost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "savePost" ADD CONSTRAINT "savePost_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "News"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

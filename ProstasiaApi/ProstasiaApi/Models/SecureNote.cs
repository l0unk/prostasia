using MongoDB.Bson;

namespace ProstasiaApi
{
    public class SecureNote
    {
        public ObjectId _id { get; set; }
        public string noteLabel { get; set; }
        public string noteContent { get; set; }

        public SecureNote(string noteLabel, string noteContent)
        {
            this._id = new ObjectId();
            this.noteLabel = noteLabel;
            this.noteContent = noteContent;
        }

        public SecureNote()
        {
            this._id = new ObjectId();
        }
    }
}
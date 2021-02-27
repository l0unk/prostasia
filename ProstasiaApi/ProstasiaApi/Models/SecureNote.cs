using MongoDB.Bson;

namespace ProstasiaApi
{
    public class SecureNote
    {
        public string _id { get; set; }
        public string noteLabel { get; set; }
        public string noteContent { get; set; }

        public SecureNote(string noteLabel, string noteContent)
        {
            this._id = ObjectId.GenerateNewId().ToString();
            this.noteLabel = noteLabel;
            this.noteContent = noteContent;
        }

        public SecureNote()
        {
            this._id = ObjectId.GenerateNewId().ToString();
        }
    }
}
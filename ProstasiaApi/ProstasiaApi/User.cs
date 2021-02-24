using System.Collections.Generic;
using System.Text.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ProstasiaApi
{
    public class User
    {
        private string _username;
        private string _password;
        private JObject _session_vars;
        public JObject session_vars
        {
            get { return _session_vars; }
            set { _session_vars = value; }
        }
        
        public string username
        {
            get { return _username; }
            set { _username = value; }
        }
        public string password
        {
            get { return _password; }
            set { _password = value; }
        }

        public User(string username, string password)
        {
            this.username = username;
            this.password = password;
        }

        public User()
        {
            session_vars = new JObject();
        }
    }
}
import streamlit as st
from copilot import run

st.set_page_config(page_title="Blending Co-Pilot", page_icon="\U0001F9EA", layout="centered")
st.title("\U0001F9EA Blending Co-Pilot")
st.caption("Grounded, cited answers from the blending corpus \u00B7 refuses when the answer isn't in the documents \u00B7 fully local")

if "messages" not in st.session_state:
    st.session_state.messages = []

# replay history
for m in st.session_state.messages:
    with st.chat_message(m["role"]):
        st.markdown(m["content"])

# input
if q := st.chat_input("Ask about diesel blending or biodiesel..."):
    st.session_state.messages.append({"role": "user", "content": q})
    with st.chat_message("user"):
        st.markdown(q)
    with st.chat_message("assistant"):
        with st.spinner("Consulting the Knowledge tool..."):
            answer = run(q, verbose=False)
        st.markdown(answer)
    st.session_state.messages.append({"role": "assistant", "content": answer})

import streamlit as st

st.set_page_config(page_title="Blending RAG", page_icon="*")

@st.cache_resource(show_spinner="Loading the model (one-time, ~1 min)...")
def load_answer():
    from brain import answer          # loads embedder + reranker + brain ONCE
    return answer

answer = load_answer()

st.title("Blending RAG assistant")
st.caption("Grounded answers from your documents. Refuses when there's no good match.")

if "history" not in st.session_state:
    st.session_state.history = []

for h in st.session_state.history:
    with st.chat_message(h["role"]):
        st.markdown(h["content"])
        if h.get("meta"):
            st.caption(h["meta"])

q = st.chat_input("Ask about diesel / biodiesel blending...")
if q:
    with st.chat_message("user"):
        st.markdown(q)
    st.session_state.history.append({"role": "user", "content": q})
    with st.chat_message("assistant"):
        with st.spinner("thinking (CPU, ~1 min)..."):
            ans, ranked, best = answer(q)
        srcs = ", ".join(f"{m['source']}#{m['chunk']}" for _, _, _, m in ranked)
        meta = f"top score {best:+.2f} · sources: {srcs}"
        st.markdown(ans)
        st.caption(meta)
    st.session_state.history.append({"role": "assistant", "content": ans, "meta": meta})
